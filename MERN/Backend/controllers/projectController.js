import Project from "../models/Project.js"
import Notification from "../models/Notification.js"

//
// ✅ CREATE PROJECT
//
export const createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body

    const project = await Project.create({
      name,
      description,
      members: [...members, req.user._id], // 👈 creator also member
      createdBy: req.user._id
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// ✅ GET ALL PROJECTS (ROLE BASED)
//
export const getProjects = async (req, res) => {
  try {
    let projects

    if (req.user.role === "Admin") {
      projects = await Project.find()
        .populate("members", "name role")
    } else {
      projects = await Project.find({
        members: req.user._id
      }).populate("members", "name role")
    }

    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// ✅ GET SINGLE PROJECT (VERY IMPORTANT)
//
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name role")

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // 🔐 ACCESS CONTROL
    if (
      req.user.role !== "Admin" &&
      !project.members.some(m => m._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        message: "Access denied"
      })
    }

    res.json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// ✅ ADD MEMBER
//
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.members) {
      project.members = []
    }

    const alreadyMember = project.members.some(
      m => m.toString() === userId
    )

    if (!alreadyMember) {
      project.members.push(userId)

      await Notification.create({
        user: userId,
        message: `You were added to project "${project.name}"`
      })

      await project.save()
    }

    res.json({ message: "Member added", project })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// ✅ REMOVE MEMBER (FIXED)
//
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }

    // only admin can remove
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Not authorized"
      })
    }

    project.members = project.members.filter(
      (m) => m.toString() !== userId
    )

    await project.save()

    res.json({
      message: "Member removed successfully",
      project
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message
    })
  }
}

// update project status
export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body

    const project = await Project.findByIdAndUpdate(req.params.id,{status},{new:true})

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

 res.json(project)
  }catch(err){
    console.log(err.response?.data)
    res.status(500).json({
      message:"Failed to update project status"
    })
  }
}
//
// ✅ DELETE PROJECT (optional but important)
//
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // 🔐 only admin or creator
    if (
      req.user.role !== "Admin" &&
      project.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized"
      })
    }

    await project.deleteOne()

    res.json({ message: "Project deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}