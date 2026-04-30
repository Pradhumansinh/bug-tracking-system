import { NavLink, useNavigate } from "react-router-dom"
import { FaHome, FaBug, FaFolder, FaCog, FaUser, FaUsers, FaUserCog} from "react-icons/fa"
import "../styles/sidebar.css"

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  return (
    <div className="sidebar">

      {/*  LOGO */}
      <h2 className="logo">🐞 Bug Tracker</h2>
          
      {/*  MENU */}
      <div className="menu">
        <NavLink to="/profile" className="nav-item">
        <FaUser/><span>Profile</span>
        </NavLink>
        <NavLink to="/dashboard" className="nav-item">
          <FaHome /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/bugs" className="nav-item">
          <FaBug /> <span>Bugs</span>
        </NavLink>

        <NavLink to="/projects" className="nav-item">
          <FaFolder /> <span>Projects</span>
        </NavLink>

        {user.role ==="Admin" &&(
        <NavLink to="/team" className="nav-item">
       <FaUsers/>  <span> Team OverView</span>
        </NavLink>)}

        {user?.role ==="Admin" &&(
        <NavLink to="/users" className="nav-item">
        <FaUserCog /><span>User Managment</span>
         </NavLink>)}
      </div>

      {/*  SETTINGS */}
      <div className="bottom">
        <NavLink to="/settings" className="nav-item">
          <FaCog /> <span>Settings</span>
        </NavLink>
      </div>
 

    </div>
  )
}

export default Sidebar
