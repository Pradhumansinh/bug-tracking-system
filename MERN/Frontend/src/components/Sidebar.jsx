// import {Link} from "react-router-dom"
// import{useNavigate} from "react-router-dom"
// import "../styles/layout.css"
// import{FaBug,FaProjectDiagram,FaUsers,FaTachometerAlt} from "react-icons/fa"


// const Sidebar=()=>{
// const navigate = useNavigate()
//     const user = JSON.parse(localStorage.getItem("user"))
//     return(
//         <div className="sidebar">
//             <h2 className="logo">Bug Tracker</h2>
//             <div className="sidebar-profile-card" onClick={()=> navigate("/profile")}>
//                 <div className="avatar">
// {user?.name?.charAt(0).toUpperCase({})}
//                 </div>
//                 <div className="profile-info">
//                     <p className="name">{user?.name}</p>
//                     <span className={`role ${user?.role?.toLowerCase()}`}>{user?.role}</span>
//                 </div>
//             </div>
//             <nav>
//                 <Link to={
//                     user?.role === "Admin" ? "/dashboard"
//                     :user?.role === "Developer" ? "/dashboard"
//                     :"/dashboard" }> <FaTachometerAlt/>Dashboard</Link>
//                 <Link to="/bugs"><FaBug />Bugs</Link>
      
//                 <Link to ="/projects"><FaProjectDiagram />Projects</Link>
//                 {user?.role ==="Admin" &&(
//                 <Link to="/users"><FaUsers />User Managment</Link>)}
              
//             </nav>
//         </div>
//     )
// }

// export default Sidebar

import { NavLink, useNavigate } from "react-router-dom"
import { FaHome, FaBug, FaFolder, FaCog, FaUser, FaUsers, FaUserCog} from "react-icons/fa"
import "../styles/sidebar.css"

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  return (
    <div className="sidebar">

      {/* 🔥 LOGO */}
      <h2 className="logo">🐞 Bug Tracker</h2>

      {/* 👤 PROFILE (CLICKABLE) */}
     

      {/* 📌 MENU */}
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

      {/* ⚙️ SETTINGS */}
      <div className="bottom">
        <NavLink to="/settings" className="nav-item">
          <FaCog /> <span>Settings</span>
        </NavLink>
      </div>
 

    </div>
  )
}

export default Sidebar