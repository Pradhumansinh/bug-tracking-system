import Bug from "../models/Bug.js"
import Project from "../models/Project.js"

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id
    const role = req.user.role

    let filter = {}

    if (role === "Developer") {
      filter.assignedTo = userId
    }

    if (role === "Tester") {
      filter.createdBy = userId
    }

    const stats = {
      total: await Bug.countDocuments(filter),
      open: await Bug.countDocuments({ ...filter, status: "Open" }),
      inProgress: await Bug.countDocuments({ ...filter, status: "In Progress" }),
      resolved: await Bug.countDocuments({ ...filter, status: "Resolved" }),
      createdToday: await Bug.countDocuments({
        ...filter,
        createdAt: { $gte: new Date().setHours(0,0,0,0) }
      })
    }

    const recentBugs = await Bug.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name")

  const projectsRaw = await Project.find({
  members: userId
}).limit(5)

const projects = []

for (let p of projectsRaw) {
  const totalBugs = await Bug.countDocuments({ project: p._id })
  const closedBugs = await Bug.countDocuments({
    project: p._id,
    status: "Closed"
  })

  const progress = totalBugs === 0
    ? 0
    : Math.round((closedBugs / totalBugs) * 100)

  projects.push({
    _id: p._id,
    name: p.name,
    status: p.status,
    progress,
    totalBugs
  })
}
    
    let myWork = []

    if (role === "Developer") {
      myWork = await Bug.find({ assignedTo: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
    }

    if (role === "Tester") {
      myWork = await Bug.find({ createdBy: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
    }

    if (role === "Admin") {
      myWork = await Bug.find({ assignedTo: null })
        .sort({ createdAt: -1 })
        .limit(5)
    }
//  LAST 7 DAYS TREND
const last7Days = [...Array(7)].map((_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  d.setHours(0, 0, 0, 0)
  return d
}).reverse()

let chartData = []

for (let i = 0; i < last7Days.length; i++) {
  const start = last7Days[i]
  const end = new Date(start)
  end.setHours(23, 59, 59, 999)

  const count = await Bug.countDocuments({
    ...filter,
    createdAt: { $gte: start, $lte: end }
  })

  chartData.push({
    day: start.toLocaleDateString("en-IN", { weekday: "short" }),
    bugs: count
  })
}
    res.json({ stats, recentBugs, projects, myWork, chartData})

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
