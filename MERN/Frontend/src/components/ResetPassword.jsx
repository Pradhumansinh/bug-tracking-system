import { useParams } from "react-router-dom"
import { useState } from "react"
import API from "../api/axios"
import "../styles/dashboard.css"
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"



const ResetPassword = () => {
  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const navigate=useNavigate()

  const handleReset = async () => {
    if(password !== confirmPassword){
        return toast.error("Passwords do not match")
    }
    try {
      await API.put(`/users/reset-password/${token}`, { password })
      toast.success("Password reset successful. Redirecting to Login")

      setTimeout(()=>{
        navigate("/")
      },3000)
    } catch (err) {
      toast.error("Invalid or expired token")
    }
  }

  return (
    <div className="auth-container">
        <div className="auth-card">
      <h2>Reset Password</h2>
      <p>Enter your new password</p>
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="password" placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)} />
      <button onClick={handleReset}>Reset Password</button>
      <p className="back-link" onClick={()=>navigate("/")}>
       &#8592; Back to Login
      </p>
      </div>
    </div>
  )
}

export default ResetPassword