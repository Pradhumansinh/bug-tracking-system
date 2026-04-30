import { Link, useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../api/axios"
import { FaHome, FaFolder, FaBug, FaCog } from "react-icons/fa"
import "../styles/breadcrumb.css"

const Breadcrumb = () => {
  const location = useLocation()
  const { id } = useParams()

  const [projectName, setProjectName] = useState("")

  const paths = location.pathname.split("/").filter(Boolean)

  // 🔥 Fetch project name if in project route
  useEffect(() => {
  if (id) {
    API.get(`/projects/${id}`)
      .then((res) => {
        console.log("Project API:", res.data)
        setProjectName(res.data.project?.name || res.data.name)
      })
      .catch(() => setProjectName("Project"))
  }
}, [id])
  // useEffect(() => {
  //   if (paths.includes("project") && id) {
  //     API.get(`/projects/${id}`)
  //       .then((res) => setProjectName(res.data.name))
  //       .catch(() => setProjectName("Project"))
  //   }
  // }, [id])

  const format = (text) => {
    return text
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const getIcon = (path) => {
    if (path === "dashboard") return <FaHome />
    if (path === "project") return <FaFolder />
    if (path === "settings") return <FaCog />
    return <FaBug />
  }

  if (location.pathname === "/dashboard") return null

  return (
    <div className="breadcrumb">
      <Link to="/dashboard" className="crumb">
        <FaHome /> Dashboard
      </Link>

      {paths.map((path, index) => {
        const routeTo = "/" + paths.slice(0, index + 1).join("/")

        let label = format(path)

        // 🔥 Replace ID with project name
        if (path === id && projectName) {
          label = projectName
        }

        return (
          <span key={index} className="crumb-wrapper">
            <span className="separator">›</span>

            {index === paths.length - 1 ? (
              <span className="crumb active">
                {getIcon(path)} {label}
              </span>
            ) : (
              <Link to={routeTo} className="crumb">
                {getIcon(path)} {label}
              </Link>
            )}
          </span>
        )
      })}
    </div>
  )
}

export default Breadcrumb