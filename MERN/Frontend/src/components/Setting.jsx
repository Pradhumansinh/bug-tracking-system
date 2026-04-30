import { useState, useEffect } from "react"
import API from "../api/axios"
import { toast } from "react-toastify"
import "../styles/setting.css"

const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  const [activeTab, setActiveTab] = useState("account")

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: ""
  })

  const [notifications, setNotifications] = useState({
    assigned: true,
    comments: true,
    status: true
  })

  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)

  // load settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings"))
    if (saved) {
      setNotifications(saved.notifications)
      setDarkMode(saved.darkMode)
    }
  }, [])

  // save settings
  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ notifications, darkMode })
    )
    document.body.classList.toggle("dark", darkMode)
  }, [notifications, darkMode])

  // UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      setLoading(true)

      await API.put("/user/update-profile", {
        name: form.name,
        email: form.email
      })

      // update localStorage
      const updatedUser = {
        ...user,
        name: form.name,
        email: form.email
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast.success("Profile updated")
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  //  CHANGE PASSWORD
  const handlePassword = async () => {
    try {
      setLoading(true)

      await API.put("/user/change-password", {
        currentPassword: prompt("Enter current password"),
        newPassword: form.password
      })

      setForm({ ...form, password: "" })
      toast.success("Password updated")
    } catch (err) {
      toast.error(err.response?.data?.message || "Password failed")
    } finally {
      setLoading(false)
    }
  }

  //  LOGOUT ALL
  const handleLogoutAll = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <div className="settings-container">

      {/* SIDEBAR */}
      <div className="settings-sidebar">
        <p className={activeTab==="account"?"active":""} onClick={()=>setActiveTab("account")}>Account</p>
        <p className={activeTab==="notifications"?"active":""} onClick={()=>setActiveTab("notifications")}>Notifications</p>
        <p className={activeTab==="appearance"?"active":""} onClick={()=>setActiveTab("appearance")}>Appearance</p>
        <p className={activeTab==="security"?"active":""} onClick={()=>setActiveTab("security")}>Security</p>
        <p className={activeTab==="about"?"active":""} onClick={()=>setActiveTab("about")}>About</p>
      </div>

      {/* CONTENT */}
      <div className="settings-content">

        {/* ACCOUNT */}
        {activeTab === "account" && (
          <>
            <h2>Account Settings</h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
            />

            <button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <hr />

            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />

            <button onClick={handlePassword}>
              Change Password
            </button>
          </>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <>
            <h2>Notification Settings</h2>

            {["assigned","comments","status"].map((key)=>(
              <label key={key} className="switch">
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      [key]: !notifications[key]
                    })
                  }
                />
                <span className="slider"></span>
                {key}
              </label>
            ))}
          </>
        )}

        {/* APPEARANCE */}
        {activeTab === "appearance" && (
          <>
            <h2>Appearance</h2>

            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={()=>setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
              Dark Mode
            </label>
          </>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <>
            <h2>Security</h2>

            <button className="danger" onClick={handleLogoutAll}>
              Logout from all devices
            </button>
          </>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <>
            <h2>About</h2>
            <p>Bug Tracker v1.0</p>
            <p>Developed by P.M.Vaghela 😎</p>
          </>
        )}

      </div>
    </div>
  )
}

export default Settings
