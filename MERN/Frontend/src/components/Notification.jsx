import { useEffect, useState } from "react"
import API from "../api/axios"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)

  // fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications")
      setNotifications(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // unread count
  const unread = notifications.filter(n => !n.read).length

  // mark as read
  const handleRead = async (id) => {
    try {
      await API.put(`/notifications/${id}`)
      fetchNotifications()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🔔 Bell */}
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", position: "relative" }}
      >
        🔔
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px"
            }}
          >
            {unread}
          </span>
        )}
      </div>

      {/* 📩 Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            width: "250px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "10px"
          }}
        >
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleRead(n._id)}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  fontWeight: n.read ? "normal" : "bold"
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications