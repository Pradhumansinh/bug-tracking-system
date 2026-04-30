import { useEffect, useState } from "react"
import API from "../api/axios"
import "../styles/usermanagement.css"
import {FaUser,FaEnvelope,FaUserShield,FaTrash} from "react-icons/fa"
import {toast} from "react-toastify"

const UserManagement = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = () => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchUsers()
  }, [])
const handleDelete = async (id) => {
  if (!window.confirm("Delete this user?")) return

  try {
    await API.delete(`/users/${id}`)
    toast.success("User deleted")
    fetchUsers() // refresh list
  } catch (err) {
    console.log(err)
    toast.error("Delete failed")
  }
}

 const handleRoleChange = async (id, newRole, currentRole) => {
  if (newRole === currentRole) return

  const confirmChange = window.confirm(
   ` Are you sure you want to change role from "${currentRole}" to "${newRole}?"
  `)

  if (!confirmChange) return

  try {
    await API.put(`/users/role/${id}`, { role: newRole })
    fetchUsers()
  } catch (err) {
    console.error(err)
    toast.error("Failed to update role")
  }
}

  return (
    
    <div className="dashboard">
      <div className="usermanagementtext">
      <h2 className="dashboard-title"><FaUser/> User Management</h2>
</div>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td><FaEnvelope/> {u.email}</td>
              <td><FaUserShield/><span className={`role-badge ${u.role.toLowerCase()}`}> 
              {u.role}
              </span>        
              </td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u._id, e.target.value,u.role)
                  }
                >
                  <option>Admin</option>
                  <option>Developer</option>
                  <option>Tester</option>
                </select>
              </td>
              <td>
              <button className="delete-btn" onClick={()=>handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
