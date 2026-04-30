import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../api/axios.js"
import "../styles/dashboard.css"
import {toast} from "react-toastify"

const ProjectDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const { id } = useParams()
  const navigate = useNavigate()
  const [commentText,setCommentText]=useState({}) 
  const[selectedBug,setSelectedBug]=useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  })

  //  FIXED FETCH
  const fetchData = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true)

      setError(null)

      const res = await API.get(`/bugs/project/${id}/bugs`)
      setData(res.data)

    } catch (err) {
      console.log("ERROR:", err.response)

      if (err.response?.status === 403) {
        setError("You no longer have access to this project")
        setTimeout(() => navigate("/projects"), 1500)
      } else if (err.response?.status === 404) {
        setError("Project not found")
      } else {
        setError(err.response?.data?.message || "Something went wrong")
      }
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  //  ONLY FIRST LOAD SHOW LOADER
  useEffect(() => {
    fetchData(true)
  }, [id])

  //  HANDLERS
  const handleDelete = async (bugId) => {
    if (!window.confirm("Delete this bug?")) return
    try {
      await API.delete(`/bugs/${bugId}`)
      fetchData()
    } catch {
    toast.error("Delete failed")
    }
  }

  const handleStatus = async (bugId, status) => {
    try {
      await API.put(`/bugs/status/${bugId}`, { status })
      fetchData()
    } catch {
      toast.error("Status update failed")
    }
  }

  const handleAssign = async (bugId, userId) => {
    try {
      await API.put(`/bugs/assign/${bugId}`, { userId })
      fetchData()
    } catch {
      toast.error("Assign failed")
    }
  }

  const handleAddMember = async (userId) => {
    if (!userId) return
    try {
      await API.put(`/projects/${id}/add-member`, { userId })
      fetchData()
    } catch {
      toast.error("Failed to add member")
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await API.put(`/projects/${id}/remove-member`, { userId })
      fetchData()
    } catch {
      toast.error("Failed to remove member")
    }
  }

  //  SAFE UI
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!data) return <p>No data</p>

  const filteredBugs = data?.bugs?.filter((bug) => {
    return (
      (filters.status === "" || bug.status === filters.status) &&
      (filters.priority === "" || bug.priority === filters.priority) &&
      (filters.search === "" ||
        bug.title.toLowerCase().includes(filters.search.toLowerCase()))
    )
  })
  const developers = data?.project?.members?.filter((user)=>user.role === "Developer")
  const handleProjectStatus = async (status) => {
  try {
    await API.put(`/projects/${id}/status`, { status })
    fetchData()
  } catch (err) {
    console.log(err)
    toast.error("Failed to update project status")
  }
}

const handleComment = async (bugId) => {
  try {
    const res = await API.post(`/bugs/${bugId}/comment`, {
      text: commentText[bugId]
    })

    //  update selectedBug instantly
    setSelectedBug((prev) =>
      prev && prev._id === bugId
        ? { ...prev, comments: res.data.comments }
        : prev
    )

    //  update table data also
    setData((prev) => ({
      ...prev,
      bugs: prev.bugs.map((b) =>
        b._id === bugId
          ? { ...b, comments: res.data.comments }
          : b
      )
    }))

    setCommentText({ ...commentText, [bugId]: "" })

  } catch (err) {
    console.log(err.response?.data)
    toast.error("Failed to comment")
  }
}

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="project-header">
        <div className="projectsname-header">
          <h2 className="project-title">{data?.project?.name}  Dashboard</h2>
          <p className="project-sub">Manage bugs and Team activity</p>
        </div>
    <div>
      <select className="status-dropdown" onChange={(e)=>handleProjectStatus(e.target.value)} value={data?.project?.status || "Active"}>
        <option>Active</option>
        <option>Completed</option>
        <option>Archived</option>
      </select>
    </div>
 <button className="delete-btn" onClick={async ()=>{
  if(!window.confirm("Delete this project?")) return
    await API.delete(`/projects/${id}`)
    navigate("/projects")
 }}>
  Delete Project
 </button>

        <button
          className="create-btn"
          onClick={() => navigate(`/create-bug?project=${id}`)}
        >
          + Create Bug
        </button>
      </div>

      {/* STATS */}
      <div className="card-container">
        <div className="card total"><h3>Total</h3><p>{data?.stats?.total}</p></div>
        <div className="card open"><h3>Open</h3><p>{data?.stats?.open}</p></div>
        <div className="card progress"><h3>In Progress</h3><p>{data?.stats?.inProgress}</p></div>
        <div className="card resolved"><h3>Resolved</h3><p>{data?.stats?.resolved}</p></div>
        <div className="card pending"><h3>Pending</h3><p>{data?.stats?.pending}</p></div>
        <div className="card closed"><h3>Closed</h3><p>{data?.stats?.closed}</p></div>
      </div>

      {/* MEMBERS */}
      <div className="members-section">
        <div className="members-header">
          <h3>Team Members</h3>

          {user?.role === "Admin" && (
            <select
              className="member-select"
              onChange={(e) => handleAddMember(e.target.value)}
            >
              <option value="">+ Add Member</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="members-grid">
          {data?.project?.members?.map((m) => (
            <div className="member-card" key={m._id}>
              <div>
                <p className="member-name">{m.name}</p>
                <span className={`member-role ${m.role.toLowerCase()}`}>
                  {m.role}
                </span>
              </div>

              {user?.role === "Admin" && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveMember(m._id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <input
          placeholder="Search bug..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Pending Verification</option>
          <option>Closed</option>
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* MAIN */}
      <div className="main-content">
        {/* BUGS */}
        <div className="bugs-section">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {filteredBugs?.map((bug) => (
    <>
      {/* MAIN ROW */}
      <tr key={bug._id}>
        <td>
          <span
          style={{ cursor: "pointer", color: "#2563eb",fontWeight:"bold" }}
         onClick={()=>setSelectedBug(bug)}>
        
          {bug.title}
          </span>
        </td>

        <td>
          <span className={`status ${bug.status?.replace(/\s/g,"").toLowerCase()}`}>
            {bug.status}
          </span>
        </td>

        <td>{bug.priority}</td>
        <td>{bug.assignedTo?.name || "Unassigned"}</td>
        <td>{bug.createdBy?.name}</td>

        <td>
          {user?.role === "Admin" && (
            <>
              <button onClick={() => handleDelete(bug._id)}>Delete</button>

              <select onChange={(e) => handleStatus(bug._id, e.target.value)}>
                <option>Change Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </>
          )}

          {(user?.role === "Admin" || user?.role === "Tester") && (
            <select onChange={(e) => handleAssign(bug._id, e.target.value)}>
              <option value="">Assign Developer</option>
              {developers?.length === 0 ? (
                <option disabled>No developers</option>
              ) : (
                developers.map((dev) => (
                  <option key={dev._id} value={dev._id}>
                    {dev.name}
                  </option>
                ))
              )}
            </select>
          )}
        </td>
      </tr>

    
    </>
  ))}
</tbody>
           
          </table>
        </div>
        {selectedBug && (
  <div className="modal-overlay">

    <div className="modal">

      {/*  CLOSE BUTTON */}
      <button
        className="close-icon"
        onClick={() => setSelectedBug(null)}
      >
        ✕
      </button>

      <h2 className="modal-title">{selectedBug.title}</h2>

      <p className="modal-desc">{selectedBug.description}</p>
{selectedBug.image && (
  <img src={selectedBug.image} alt="bug" className="modal-img" onError={(e)=>{
    e.target.style.display="none"
  }} />
)}
      {/* COMMENTS */}
      <div className="comments-box">
        <p style={{fontSize:"20px",fontWeight:"bold"}}>Comments...</p>
       {selectedBug.comments?.map((c, i) => (
  <div key={i} className="comment">
    <b>{c.user?.name}</b>: {c.text}

    {/* ACTIONS */}
    {(c.user?._id === user._id || user.role === "Admin") && (
      <div style={{ marginTop: "4px" }}>
        <button
          onClick={async () => {
            const newText = prompt("Edit comment", c.text)
            if (!newText) return

            await API.put(`/bugs/${selectedBug._id}/comment/${c._id}`, {
              text: newText
            })

            fetchData()
          }}
        >
          ✏️
        </button>

        <button
          onClick={async () => {
            if (!window.confirm("Delete comment?")) return

            await API.delete(`/bugs/${selectedBug._id}/comment/${c._id}`)
            fetchData()
          }}
        >
      🗑️
        </button>
      </div>
    )}
  </div>
))}
      </div>

      {/* ADD COMMENT */}
      <input
        type="text"
        placeholder="Write comment..."
        value={commentText[selectedBug._id] || ""}
        onChange={(e) =>
          setCommentText({
            ...commentText,
            [selectedBug._id]: e.target.value
          })
        }
        className="comment-input"
      />

      <button
        onClick={() => handleComment(selectedBug._id)}
        className="post-btn"
      >
        Post Comment
      </button>

    </div>
  </div>
)}
    

        {/* ACTIVITY */}
        <div className="activity-section">
          <h3 className="section-title">Activity History</h3>

          <div className="timeline">
            {data?.bugs?.filter(bug=>bug.history && bug.history.length > 0)
            .flatMap((bug) =>
              bug.history?.map((h, i) => (
                <div className="timeline-item" key={bug._id + i}>
                  <div className="dot"></div>

                  <div className="timeline-content">
                    <p className="action">{h.action}</p>
                    <span className="meta">
                      {h.user?.name || "Unknown"} •{" "}
                      {h.timestamp
                        ? new Date(h.timestamp).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
     
      </div>
    </div>
  )
}

export default ProjectDashboard
