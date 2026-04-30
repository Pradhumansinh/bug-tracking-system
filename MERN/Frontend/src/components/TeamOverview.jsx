import { useEffect, useState } from "react"
import API from "../api/axios"
import "../styles/team.css"
import {FaUsers} from "react-icons/fa"

const TeamOverview = () => {
  const [team, setTeam] = useState([])

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await API.get("/users/team-overview")
        setTeam(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchTeam()
  }, [])

  return (
    <div className="team-container">
        <div className="team-header">
      <h2><FaUsers/> Team Performance</h2>
</div>
      <div className="team-grid">
        {team.map((u) => (
          <div key={u._id} className="team-card">
            <h3>{u.name}</h3>
            <span className={`role ${u.role.toLowerCase()}`}>
              {u.role}
            </span>

            <p>Total Work: {u.total}</p>
            <p>Resolved: {u.resolved}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${u.total ? (u.resolved / u.total) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamOverview