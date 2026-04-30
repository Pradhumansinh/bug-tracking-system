import { useState } from "react"
import API from "../api/axios"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import "../styles/auth.css"

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post("/auth/register", form)
      toast.success("Account created!")
      navigate("/")
    } catch {
      toast.error("Registration failed")
    }
  }

  return (
    <div className="auth-wrapper">

      <div className="auth-left">
        <h1>Join BTS</h1>
        <p>Create account & start tracking bugs efficiently</p>
      </div>

      <div className="auth-card">

        <h2>Create Account 🚀</h2>
        <p className="sub-text">It takes less than a minute</p>

        <form onSubmit={handleSubmit}>

          <div className="input-box">
            <FaUser />
            <input
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="input-box">
            <FaEnvelope />
            <input
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="input-box">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button type="submit">Create Account</button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  )
}

export default Register