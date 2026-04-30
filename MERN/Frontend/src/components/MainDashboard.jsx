import { useEffect, useState } from "react"
import API from "../api/axios"
import "../styles/mainDashboard.css"
import {LineChart, Line ,XAxis, YAxis,Tooltip,ResponsiveContainer} from "recharts"
import {FaBug,FaCheckCircle,FaClock,FaSpinner,FaProjectDiagram,FaChartLine,FaFire,FaList} from "react-icons/fa"
import {useNavigate} from "react-router-dom"

const MainDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate=useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBug,setSelectedBug]=useState(null)

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard")
      setData(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  return (
    <div className="dashboard">

      {/* 🔥 HEADER */}
      <div className="dashboard-header">
        <h2>{user?.role} Dashboard</h2>
        
      {user.role === "Admin" && <p>👑 Admin Insights</p>}
{user.role === "Developer" && <p>🛠️ Your Tasks</p>}
{user.role === "Tester" && <p>🧪 Your Reports</p>}
      </div>

      {/* 📊 SUMMARY CARDS */}
    <div className="card-container">

 <div className="card total">
  <div className="card-header">
    <FaBug className="icon" />
    <p>Total Bugs</p>
  </div>
  <h2>{data.stats.total}</h2>
</div>

<div className="card open">
  <div className="card-header">
    <FaFire className="icon" />
    <p>Open</p>
  </div>
  <h2>{data.stats.open}</h2>
</div>

<div className="card progress">
  <div className="card-header">
    <FaSpinner className="icon" />
    <p>In Progress</p>
  </div>
  <h2>{data.stats.inProgress}</h2>
</div>

<div className="card resolved">
  <div className="card-header">
    <FaCheckCircle className="icon" />
    <p>Resolved</p>
  </div>
  <h2>{data.stats.resolved}</h2>
</div>

<div className="card today">
  <div className="card-header">
    <FaClock className="icon" />
    <p>Today</p>
  </div>
  <h2>{data.stats.createdToday}</h2>
</div>
 </div>
      {/* 📊 TREND CHART */}
      <div className="dashboard-grid">
<div className="left-panel">
<div className="section">
  <h3><FaChartLine /> Bug Trends (Last 7 Days)</h3>

  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data.chartData}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="bugs" stroke="#4f46e5" strokeWidth={4} dot={{r:4}} />
    </LineChart>
  </ResponsiveContainer>
</div>
        {/* 📁 PROJECT OVERVIEW */}
<div className="section">
  <h3><FaProjectDiagram /> Active Projects</h3>

  <div className="projects">
    {data.projects.map((p) => (
      <div key={p._id} className="project-card" onClick={()=>navigate(`/projects/${p._id}`)} style={{cursor:"pointer"}}>
        <h4>{p.name}</h4>

        <p>{p.totalBugs} Bugs</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${p.progress}% `}}
          ></div>
        </div>

        <small>{p.progress}% Completed</small>
      </div>
    ))}
  </div>
</div>
</div>
      {/* ⚡ RECENT ACTIVITY */}
      <div className="right-panel">
      <div className="section">
        <h3><FaList /> Recent Activity</h3>
        {data.recentBugs.map((bug) => (
          <div key={bug._id} className="activity-item">
            <FaBug className="small-icon" />
            <div>
            <p>{bug.title}</p>
            <small>by {bug.createdBy?.name}</small>
          </div>
          </div>
        ))}
      </div>
      {/* 🔥 MY WORK */}
<div className="section">
  <h3><FaFire/>My Work</h3>

  {data.myWork.length === 0 ? (
    <p>No work assigned</p>
  ) : (
    data.myWork.map((bug) => (
      <div key={bug._id} className="work-card" onClick={()=>setSelectedBug(bug)} style={{cursor:"pointer"}}>
        <FaBug className="small-icon" />
        <div>
        <h4>{bug.title}</h4>
        <p>Status: {bug.status}</p>
        <p>Priority: {bug.priority}</p>
      </div>
      </div>
    ))
  )}
</div>
</div>
</div>
  {selectedBug && (
  <div className="modal-overlay" onClick={() => setSelectedBug(null)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      
      <button
        className="close-btn"
        onClick={() => setSelectedBug(null)}
      >
        ✖️
      </button>

      <h2>{selectedBug.title}</h2>
      <p>{selectedBug.description}</p>

      <p><b>Status:</b> {selectedBug.status}</p>
      <p><b>Priority:</b> {selectedBug.priority}</p>

      {selectedBug.image && (
        <img src={selectedBug.image} className="modal-img" />
      )}

    </div>
  </div>
)}
    </div>
    

  )

}

export default MainDashboard