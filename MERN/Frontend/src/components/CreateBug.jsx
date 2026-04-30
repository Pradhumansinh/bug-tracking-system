import { useState, useEffect } from "react"
import API from "../api/axios"
import { toast } from "react-toastify"
import { useSearchParams } from "react-router-dom"
import "../styles/createBug.css"
import Breadcrumbs from "./Breadcrumbs"

const CreateBug = () => {
  const [searchParams] = useSearchParams()
  const projectFromURL = searchParams.get("project")

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    project: projectFromURL || "",
  })

  const [image, setImage] = useState(null) // ✅ FIXED
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])

  // fetch users
  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(console.error)
  }, [])

  // fetch projects
  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("priority", form.priority)
      formData.append("assignedTo", form.assignedTo)
      formData.append("project", form.project)

      if (image) {
        formData.append("image", image)
      }

      await API.post("/bugs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Bug created successfully")

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        assignedTo: "",
        project: projectFromURL || "",
      })

      setImage(null) // reset image
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Error while creating bug")
    }
  }

  return (
    <div className="create-bug">
      <div className="bug-card">
      <h2>&#128030; Create Bug</h2>
    

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Project */}
        <select
          value={form.project}
          disabled={!!projectFromURL}
          onChange={(e) =>
            setForm({ ...form, project: e.target.value })
          }
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Assign */}
        <select
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
        >
          <option value="">Assign User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image && (<img src={URL.createObjectURL(image)} className="preview-img" />)}

        <button type="submit">&#128640; Create Bug</button>
      </form>
      </div>
    </div>
  )
}

export default CreateBug