import { useEffect, useState } from "react"
import API from "../api/axios"
import "../styles/profile.css"

const Profile = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile") //  fixed route
        setData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProfile()
  }, [])

  //  prevent crash
  if (!data) return <p>Loading...</p>

  //  fallback structure (so UI doesn't break)
  const user = data.user || data
  const stats = data.stats || { total: 0, open: 0, resolved: 0 }
  const myWork = data.myWork || []
  const projects = data.projects || []

  return (
    <div className="mainprofile-container">

      {/* HEADER */}
      <div className="mainprofile-header">
        <div className="avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className={`role ${user?.role?.toLowerCase()}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="card5">Total: {stats.total}</div>
        <div className="card5">Open: {stats.open}</div>
        <div className="card5">Resolved: {stats.resolved}</div>
      </div>

      {/* MY WORK */}
      <div className="section">
        <h3>My Work</h3>

        {myWork.length === 0 ? (
          <p>No work available</p>
        ) : (
          myWork.map((bug) => (
            <div key={bug._id} className="work-card">
              <h4>{bug.title}</h4>
              <p>{bug.status}</p>
            </div>
          ))
        )}
      </div>

      {/* PROJECTS */}
      <div className="section">
        <h3>Projects</h3>

        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((p) => (
            <div key={p._id} className="project-card">
              <h4>{p.name}</h4>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Profile
