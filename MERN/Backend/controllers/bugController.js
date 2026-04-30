import Bug from "../models/Bug.js"
import User from "../models/User.js"
import Project from "../models/Project.js"
import Notification from "../models/Notification.js"
import multer from "multer"


export const createBug = async (req,res) =>{
    try{
         const {title,description,priority,assignedTo,project}=req.body
         if(!project){
            return res.status(400).json({
                message:"Project is required"
            })
         }
      
         const bug = await Bug.create({
              title,
              description,
              priority,
              assignedTo,
              project,
              createdBy: req.user._id, 
              image: req.file?.path,  //from token
               history:[{
            action:"Bug created",
            user: req.user._id
         }]

         })
        

         res.status(201).json(bug)
    }catch(error){
        res.status(500).json({
            message:error.message
        })

    }
}

export const getBugs = async(req,res)=>{
  try{
    const page = Number(req.query.page) || 1
    const limit = 5

    const {status,priority,search} = req.query
    let query = {}

    if (req.user.role !== "Admin") {
      const projects = await Project.find({
        members:req.user._id
      }).select("_id")

      const projectIds = projects.map(p=>p._id)
      query.project = { $in: projectIds }
    }

    if (req.user.role === "Developer"){
      query.assignedTo = req.user._id
    }

    if (req.user.role === "Tester"){
      query.createdBy = req.user._id
    }

    if (req.query.project){
      query.project = req.user.role ==="Admin"
        ? req.query.project
        : { $in:[req.query.project] }
    }

    if(status) query.status=status
    if(priority) query.priority=priority
    if(search) query.title = { $regex:search,$options:"i"}

    // 🔥 TOTAL COUNT (IMPORTANT)
    const total = await Bug.countDocuments(query)

    const bugs = await Bug.find(query)
      .skip((page-1)* limit)
      .limit(limit)
      .populate("assignedTo","name email")
      .populate("createdBy","name email")
      .populate("project","name") // ✅ ADD THIS

    res.json({
      bugs,
      page,
      totalPages: Math.ceil(total / limit),
      total
    })

  }catch(error){
    res.status(500).json({
      message:error.message
    })
  }
}


     
    


export const getBugById = async (req,res)=>{
       try{
        const bug = await Bug.findById(req.params.id)
        if (!bug){
            return res.status(404).json({
                message:"Bug not found"
            })
        }
         res.json(bug)
    }catch(error){
    res.status(500).json({
        message:error.message
    })
   }
}


export const updateBug = async(req,res)=>{
    try{
        const bug = await Bug.findById(req.params.id)

        if(!bug) {
            return res.status(404).json({
                message:"Bug not found"
            })
        }

        Object.assign(bug,req.body)
        const updatedBug = await bug.save()

        res.json(updatedBug)

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

export const deleteBug = async (req,res)=>{
    try{
        const bug = await Bug.findById(req.params.id)

        if(!bug){
            return res.status(404).json({
                message:"Bug not found"
            })
            
        }
    await bug.deleteOne()
    res.status(200).json({
        message:"Bug deleted successfully"
    })

    }catch(error){
        res.status(500).json({
            message: error.message
      })
    }
}


//assign bug by tester and admin only
export const assignBug = async(req,res)=>{
    try{
        const {userId} = req.body

        const bug = await Bug.findById(req.params.id)

        if(!bug){
            return res.status(404).json({
                message:"Bug not found"
            })

        }

        bug.assignedTo = userId
        bug.history.push({
            action:"Bug assigned",
            user:req.user._id

        })
        if(bug.assignedTo?.toString() !==userId){
        await Notification.create({
            user:userId,
            message:`Bug "${bug.title}" assigned by ${req.user.name}`
        })
    }
        await bug.save()

        res.json({
            message:"Bug assigned successfully",bug
        })
       
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}


//update status

export const updateBugStatus = async (req, res) => {
  try {
    const { status } = req.body
    const bug = await Bug.findById(req.params.id)

    if (!bug) {
      return res.status(404).json({
        message: "Bug not found"
      })
    }

    const role = req.user.role

    // ✅ ADMIN (full control)
    if (role === "Admin") {
      bug.status = status
    }

    // ✅ DEVELOPER
    else if (role === "Developer") {
      if (["In Progress", "Resolved"].includes(status)) {
        bug.status = status
      } else {
        return res.status(403).json({
          message: "Developer not allowed"
        })
      }
    }

    // ✅ TESTER (verification)
    else if (role === "Tester") {
      // only creator can verify
      if (bug.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Only creator can verify this bug"
        })
      }

      if (status === "Closed") {
        bug.status = "Closed"
      } else if (status === "Open") {
        bug.status = "Open" // reopen
      } else if (status === "Pending Verification") {
        bug.status = "Pending Verification"
      } else {
        return res.status(403).json({
          message: "Invalid action"
        })
      }
    }
     bug.history.push({
        action:`Status changed to ${bug.status}`,
        user:req.user._id

     })
     if(bug.createdBy.toString() !==req.user._id.toString()){
    await Notification.create({
        user:bug.createdBy,
        Message:`Bug "${bug.title}" status changed to ${bug.status}`
    })
}
    await bug.save()

    res.json({
      message: "Status updated",
      bug
    })


  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
    
            export const getDashboardStats = async (req,res)=>{
            try {
                let filter = {}
                //role based filtering
                if(req.user.role==="Developer"){
                    filter.assignedTo= req.user._id
                }

                if (req.user.role==="Tester"){
                    filter.createdBy= req.user._id
                }

                //bug stats
                const total = await Bug.countDocuments(filter)
                const open = await Bug.countDocuments({...filter,status:"Open"})
                const inProgress = await Bug.countDocuments({...filter,status:"In Progress"})
                const resolved = await Bug.countDocuments({...filter,status:"Resolved"})
                const closed = await Bug.countDocuments({...filter,status:"Closed"})
                const pendingVerification = await Bug.countDocuments({...filter,status:"Pending Verification"})

                //extra for admin
                let users = 0
                let highPriority = 0

                if (req.user.role ==="Admin"){
                    users = await User.countDocuments()
                    highPriority= await Bug.countDocuments({ priority:"High"})
                }

                res.json({
                    role:req.user.role,
                    stats:{
                        total,open,inProgress,resolved,pendingVerification,closed
                    },
                    extra:req.user.role ==="Admin" ? {
                        totalUsers: users,
                        highPriorityBugs:highPriority,
                    }
                    :undefined,
                })
            }catch(error){
                res.status(500).json({
                    message:error.message
                })
            }
        }
 

      
        export const getProjectDashboard = async (req,res)=>{
            try{
             const {id} = req.params

            //  check access
            const project = await Project.findById(req.params.id)
            .populate("members","name role")

            if(!project){
                return res.status(404).json({
                    message:"Project not found"
                })
            }
            if(req.user.role !=="Admin" && !project.members.some(m=>m._id.toString() ===req.user._id.toString())){
                return res.status(403).json({
                    message:"Access denied"
                })
            }

            //  stats
            const total=await Bug.countDocuments({project:id})
            const open=await Bug.countDocuments({project:id,status:"Open"})
            const inProgress=await Bug.countDocuments({project:id,status:"In Progress"})
            const resolved=await Bug.countDocuments({project:id,status:"Resolved"})
            const pending=await Bug.countDocuments({project:id,status:"Pending Verification"})
            const closed=await Bug.countDocuments({project:id,status:"Closed"})

            const recentBugs = await Bug.find({project:id})
                                        .sort({createdAt:-1})
                                        .limit(5)
                                        .populate("assignedTo","name")
                                        .populate("createdBy","name")
                                        .populate("history.user","name role");

                 res.json({
          project,stats:{ total,open,inProgress,resolved,pending,closed},recentBugs
                  })
                 console.log("Recent BUgs:",recentBugs)
            }catch(error){
                   res.status(500).json({
                    message:error.message
                   })
            }
        }

        export const getBugsByProject = async (req,res)=>{
            try{
                const project = await Project.findById(req.params.id)
                         .populate("members","name role")
                         if(!project.members){
                            project.members=[]
                         }
                const bugs = await Bug.find({ project:req.params.id})
                                    .populate("assignedTo","name")
                                    .populate("createdBy","name")
                                    .populate("history.user","name role")
                                    .populate("comments.user","name")
            const stats={
                total:bugs.length,
                open:bugs.filter(b=>b.status === "Open").length,
                inProgress: bugs.filter(b=>b.status ==="In Progress").length,
                resolved: bugs.filter(b=>b.status ==="Resolved").length,
                pending: bugs.filter(b=>b.status ==="Pending Verification").length,
                closed: bugs.filter(b=>b.status ==="Closed").length,
            }  
            res.json({
                project,
                stats,
                bugs
            })            

            }catch(error){
                  res.status(500).json({
                    message:error.message
                  })
            }
        }

export const addComment = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)

    if (!bug) {
      return res.status(404).json({
        message: "Bug not found"
      })
    }

    bug.comments.push({
      text: req.body.text,
      user: req.user._id
    })

if (bug.createdBy.toString() !== req.user._id.toString()) {
  await Notification.create({
    user: bug.createdBy,
    message: `${req.user.name} commented on "${bug.title}"`
  })
}

if (bug.assignedTo && bug.assignedTo.toString() !== req.user._id.toString()) {
  await Notification.create({
    user: bug.assignedTo,
    message: `${req.user.name} commented on "${bug.title}"`
  })
}

    await bug.save()
    await bug.populate("comments.user","name")
    res.json(bug)
}catch(err){
    res.status(500).json({
        message:"err.message"
    })
}
}

// ✏️ EDIT COMMENT
export const editComment = async (req, res) => {
  try {
    const { text } = req.body
    const bug = await Bug.findById(req.params.bugId)

    const comment = bug.comments.id(req.params.commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // only owner can edit
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" })
    }

    comment.text = text

    bug.history.push({
      action: "Comment edited",
      user: req.user._id
    })

    await bug.save()

    res.json({ message: "Comment updated", bug })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ❌ DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.bugId)

    const comment = bug.comments.id(req.params.commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // owner OR admin
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Not allowed" })
    }

    comment.deleteOne()

    bug.history.push({
      action: "Comment deleted",
      user: req.user._id
    })

    await bug.save()

    res.json({ message: "Comment deleted", bug })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}