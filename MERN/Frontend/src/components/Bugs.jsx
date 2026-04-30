import {useEffect,useState} from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import {toast} from "react-toastify"
import "../styles/bugs.css"
import {FaBug} from "react-icons/fa"




const Bugs=()=>{
    const[bugs,setBugs]=useState([])
    const [users,setUsers]=useState([])  
    const [filters,setFilters]=useState({search:"",status:"",priority:""})
    const navigate = useNavigate()
    const[data,setData]=useState(null)
    const [page,setPage]=useState(1)
    const user = JSON.parse(localStorage.getItem("user"))

   const fetchBugs = async () => {
  try {
    const res = await API.get(`/bugs?page=${page}`, {
      params: filters
    })

    setBugs(res.data.bugs)   // ✅ actual bugs array
    setData(res.data)        // ✅ pagination info

  } catch (err) {
    console.error(err)
  }
}

    useEffect(()=>{
        fetchBugs()},[filters,page])

        useEffect(()=>{
            API.get("/users")
            .then((res)=>setUsers(res.data))
            .catch(console.error)
        },[])

        

    //delete
    const handleDelete = async (id)=>{
        if (!confirm("Delete this bug?"))
            return
        try{
            await API.delete(`/bugs/${id}`)
            fetchBugs()
            toast.success("Deleted successfullly")
        } catch(err){
            console.error(err)
            toast.error("Delete failed")
        }
        }


        //update status
        const handleStatus = async (id,status)=>{
            try {
                await API.put(`/bugs/status/${id}`,{status})
                fetchBugs()
                toast.success("Status updated")
             }catch(err){
                console.error(err)
                toast.error(err.response?.data?.message || "Status update failed")
             }
        }
       const handleAssign = async (bugId, userId) =>{
        try{
            await API.put(`/bugs/assign/${bugId}`,{userId})
            fetchBugs()
            toast.success("Bug assigned")
        }catch(err){
            console.error(err)
            toast.error("Assign failed")
        }
       }

    return(
        <div className="bugs-container">
           <div className="bugmanagement-header"> <h2>
                <FaBug/> Bug Managment
            </h2>
</div>

            {(user?.role === "Tester" ||
            user?.role==="Admin") && 
            (<button onClick={()=>navigate ("/create-bug")}>
                + Create Bug
            </button>
            )
}


             
            {/* filters */}
             <div className="filters">
                <input placeholder="Search..." onChange={(e)=>setFilters({...filters,search:e.target.value})}/>

                <select onChange={(e)=>setFilters({...filters,status:e.target.value}) }>
                    <option value="">All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Verification Pending</option>
                    <option>Closed</option>
                </select>

                <select onChange={(e)=>setFilters({...filters,priority:e.target.value})}>
                <option value = "">All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                </select>
             </div>


            <table className="bugs-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Assigned To</th>
                        <th>Project</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                   {bugs.map((bug)=>(<tr key={bug._id}>
                    <td>{bug.title}</td>
                    <td>{bug.description}</td>
                    <td>{<span className={`status ${bug.status.replace(/\s+/g ,"").toLowerCase()}`}>
                        {bug.status}
                        </span>}</td>
                    <td>{bug.priority}</td>
                    <td>{user?.role === "Admin"? (<select value = {bug.assignedTo?._id || ""}
                         onChange={(e)=>handleAssign(bug._id,e.target.value)}
                        >
                            <option value="">Unassigned</option>
                            {users.map((u)=>(
                                <option key = {u._id} value={u._id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                        ) : (
                            bug.assignedTo?.name || "Unassigned"
                        )}
                        </td>
   <td>
    <span
    className="project-tag"
    onClick={(e) => {e.stopPropagation() 
    navigate(`/projects/${bug.project?._id}`)}} title="Open Project"
  >
    &#x1F4C1; {bug.project?.name || "No Project"}
  </span>
</td>
                    <td>
                        {/* admin */}
                        {user?.role === "Admin" && (
                        <select onChange={(e)=>handleStatus(bug._id,e.target.value)}>
                            <option>Change Status</option>
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Pending Verification</option>
                            <option>Closed</option>
                        </select>
                        
                        )}

                       {/* developer */}
                         {user?.role === "Developer" && bug.status === "In Progress" && (
                         <button onClick={()=>handleStatus(bug._id,"Resolved")}>
                            Mark Resolved
                         </button>
                        
                        )}

                        {/* tester */}
                        {user?.role === "Tester" && bug.status === "Pending Verification" &&(<>
                        <button onClick={()=>handleStatus(bug._id,"Closed")}>Approve</button>
                        <button onClick={()=>handleStatus(bug._id,"Reopen")}>Reject</button>
                        </>)}
                    </td>                       
                   </tr>
                ))}
                </tbody>
            </table>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    Prev
  </button>

  <span style={{ margin: "0 10px" }}>
    Page {data?.page} / {data?.totalPages}
  </span>

  <button
    disabled={page === data?.totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>
        </div>
    )
}


export default Bugs