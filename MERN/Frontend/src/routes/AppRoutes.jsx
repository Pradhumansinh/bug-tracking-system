import react from "react"
import {Routes,Route} from "react-router-dom"
import Login from "../components/Login.jsx"
import Register from "../components/Register.jsx"
import MainDashboard from "../components/MainDashboard.jsx"
import Bugs from "../components/Bugs.jsx"
import Layout from "../components/Layout.jsx"
import ProtectedRoute from "./ProtectedRoutes.jsx"
import CreateBug from "../components/CreateBug.jsx"
import Projects from "../components/Project.jsx"
import ProjectDashboard from "../components/ProjectDashboard.jsx"
import UserManagement from "../components/UserManagement.jsx"
import ForgotPassword from "../components/ForgotPassword.jsx"
import ResetPassword from '../components/ResetPassword.jsx'
import Profile from "../components/Profile.jsx"
import Setting from "../components/Setting.jsx"
import TeamOverview from "../components/TeamOverview.jsx"

const AppRoutes = ()=>{
    return(
        <Routes>
            <Route path = "/" element = {<Login/>}/>
            <Route path = "/register" element = {<Register/>}/>
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path ="/dashboard" element={<ProtectedRoute><Layout><MainDashboard /></Layout></ProtectedRoute>} />
            <Route path = "/bugs" element = {<ProtectedRoute><Layout><Bugs /></Layout></ProtectedRoute>}/>
            <Route path = "/create-bug" element={<ProtectedRoute><Layout><CreateBug /></Layout></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><Layout><ProjectDashboard /></Layout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute role="Admin"><Layout><UserManagement /></Layout></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword/>}/>
            <Route path="/settings" element={<ProtectedRoute><Layout><Setting /></Layout></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute role="Admin"><Layout><TeamOverview/></Layout></ProtectedRoute>} />
        </Routes>
    )
}

export default AppRoutes


