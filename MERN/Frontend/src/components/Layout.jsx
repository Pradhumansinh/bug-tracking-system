import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import "../styles/layout.css"
import Breadcrumb from "../components/Breadcrumbs"
const Layout = ({children})=>{
    return(
        <div className="layout">
            <Sidebar /> 
            <div className="main">
                <Navbar />
                <Breadcrumb />
                <div className="content">
                      {children}
                </div>
            </div>
        </div>
    )
}

export default Layout