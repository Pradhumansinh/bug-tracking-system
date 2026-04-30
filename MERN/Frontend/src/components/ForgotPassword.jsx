import { useState } from "react"
import API from "../api/axios"
import "../styles/dashboard.css"
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"

const ForgotPassword = () => {
    const [loading,setLoading]=useState(false)
  const [email, setEmail] = useState("")
    const navigate= useNavigate()

  const handleSubmit = async () => {
    try {
       setLoading(true)

      await API.post(`/users/forgot-password`, { email })
      toast.success("Reset link sent to your email")
    } catch (error) {
      toast.error("Error sending email")
    }finally{
        setLoading(false)
    }
  }

  return (
    <div className="auth-container">
        <div className="auth-card">
      <h2>Forgot Password</h2>
      <h4 className=" smaller-paragraph">Please enter the email address you'd like your password reset information sent to</h4>
      <input
      type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>{loading? "Sending..." :"Send Reset Link"}</button>
      <p className="back-link" onClick={()=>navigate("/")}>
       &#8592; Back to Login
      </p>
      </div>
    </div>
  )
}

export default ForgotPassword