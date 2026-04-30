import { useEffect, useState } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import "../styles/project.css"
import { FaFolder } from "react-icons/fa"
import {toast} from "react-toastify"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: ""
  })

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  // 🔹 fetch projects
  const fetchProjects = () => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  //  create project
  const handleCreate = async () => {
    try {
      await API.post("/projects", form)

      toast.success("Project created")

      setForm({ name: "", description: "" })
      setShowForm(false)

      fetchProjects()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error creating project")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="project1-header">
        <h2><FaFolder/> Projects</h2>
        </div>
     

      {/* Admin Create Button */}
      {user?.role === "Admin" && (
        <button onClick={() => setShowForm(!showForm)}>
          + Create Project
        </button>
      )}

      {/*  Create Form */}
      {showForm && (
        <div style={{ margin: "20px 0" }}>
          <input
            placeholder="Project Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button onClick={handleCreate}>
            Create
          </button>
        </div>
      )}

      {/*  Project List */}
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div
  key={project._id}
  className="project-card"
  onClick={() => navigate(`/projects/${project._id}`)}
>
  <div className="project-row">
    
    {/* LEFT SIDE */}
    <div className="project-left">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>

    {/* RIGHT SIDE */}
    <div className="project-right">
      <span className={`project-status ${project.status?.toLowerCase()}`}>
        {project.status}
      </span>
    </div>

  </div>
</div>
        ))
      )}
    </div>
  )
}

export default Projects
