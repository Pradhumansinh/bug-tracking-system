import {useContext} from "react"
import {AuthContext} from "../context/AuthContext"
import "../styles/layout.css"
import Notifications from "./Notification"


const Navbar = ()=>{
    const {user,logout}=useContext(AuthContext)
    return(
        <div className="navbar" style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"10px 20px",
            borderBottom:"1px solid #ddd"
        }}>
            <h3>
                Welcome,{user?.name}
            </h3>
            <div style={{display:"flex",gap:"20px",alignItems:"center",position:"relative"}}>
                <Notifications />
            
            <button onClick={logout}>
                Logout
            </button>
        </div>
        </div>
    )
}

export default Navbar