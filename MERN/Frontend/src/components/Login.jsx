import { useState, useContext } from "react"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import "../styles/auth.css"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post("/auth/login", form)
      login(res.data)

      const role = res.data.user.role
      navigate("/dashboard")

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="auth-wrapper">

      <div className="auth-left">
        <h1>Bug Tracking System</h1>
        <p>Track bugs. Manage teams. Ship faster.</p>
      </div>

      <div className="auth-card">

        <h2>Welcome Back 👋</h2>
        <p className="sub-text">Login to continue</p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="input-box">
            <FaEnvelope />
            <input
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="input-box">
            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="forgot">
            <span onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

      </div>
    </div>
  )
}

export default Login