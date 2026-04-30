import User from "../models/User.js"
import bcrypt from "bcryptjs"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
import Project from "../models/Project.js"
import Bug from "../models/Bug.js"






export const createUser = async (req,res)=>{
    const{name,email,password,role} = req.body

    try{
      console.log("Request Received")
        //check if user exists
        const existingUser= await User.findOne({email})
          if(existingUser){
            return res.status(400).json({message:"User already exists"})
          }

          // hash password
          const salt=await bcrypt.genSalt(10)
          const hashedPassword= await bcrypt.hash(password, salt)

          // create user
          const user = await User.create({
            name,email,password:hashedPassword,role,
          })

          //send welcome email
          await sendEmail(
            email,"Welcome to Bug Tracking System",
            `Hello ${name},your account has been created succesfully.`,
          )

          res.status(201).json({
            message:"User created successfully",
            user
          })
    }catch (error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // ❗ prevent admin deleting himself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete yourself"
      })
    }

    // ✅ REMOVE FROM PROJECTS
    await Project.updateMany(
      { members: user._id },
      { $pull: { members: user._id } }
    )

    // ✅ UNASSIGN BUGS
    await Bug.updateMany(
      { assignedTo: user._id },
      { $unset: { assignedTo: "" } }
    )

    // ✅ DELETE USER
    await user.deleteOne()

    res.json({
      message: "User deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


export const getUsers = async (req,res)=>{
  try{
    const users = await User.find().select("-password")
    res.json(users)
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

export const updateUserRole=async(req,res)=>{
  try{
    const{role}=req.body
    const user = await User.findById(req.params.id)
    if(!user){
      return res.status(404).json({
        messagr:"User not found"
      })
    }
    user.role= role
    await user.save()
    res.json({
      message:"Role updated",user
    })
  }catch(error){
    res.status(500).json({
      message:error.message
    })
  }
}


export const forgotPassword = async(req,res)=>{
  try{
    const {email}=req.body
    const user = await User.findOne({email})
    if(!user){
      return res.status(404).json({
        message:"User not found"
      })
    }
      // generate token
      const resetToken=user.getResetPasswordToken()
         
       await user.save({validateBeforeSave:false})

         //email setup
          const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
              user:process.env.EMAIL_USER,
              pass:process.env.EMAIL_PASS,
            }
          })

          const resetUrl = `http://localhost:5173/reset-password/${resetToken}`

          const message=`You requested a password reset .
          
          Click here:
          ${resetUrl}
          
          This link will expire in 15 minutes.
          
          If you didn't request this,
          please ignore this email.`

          await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:user.email,
            subject:"Password Reset",
            text:message
          })
          res.json({
            message:"Reset link sent to email"
          })
        }catch(error){
          console.log(error)
          res.status(500).json({
            message:error.message
          })
        }
  }


  export const resetPassword = async (req,res)=>{
    try{
console.log(req.body)
      const hashedToken=crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")
     
      const user= await User.findOne({
        resetPasswordToken:hashedToken,
        resetPasswordExpire:{$gt:Date.now()}
      })

      if (!user){
        return res.status(404).json({
          message:"Invaild or Expired token"
        })
      }

   
    user.password = req.body.password
    user.resetPasswordToken= undefined
    user.resetPasswordExpire=undefined
      await user.save()
      res.json({
        message:"Password reset successful"
      })
    }catch(error){
      console.log(error)
      res.status(500).json({
        message:error.message
      })
    }
  }
 

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const role = req.user.role

    // 🔹 ROLE BASED FILTER
    let filter = {}

    if (role === "Developer") {
      filter.assignedTo = userId
    }

    if (role === "Tester") {
      filter.createdBy = userId
    }

    // 🔹 STATS
    const total = await Bug.countDocuments(filter)
    const open = await Bug.countDocuments({ ...filter, status: "Open" })
    const resolved = await Bug.countDocuments({ ...filter, status: "Resolved" })

    // 🔹 MY WORK
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
      myWork = await Bug.find({})
        .sort({ createdAt: -1 })
        .limit(5)
    }

    // 🔹 PROJECTS
    const projects = await Project.find({
      members: userId
    }).select("name")

    // ✅ FINAL RESPONSE
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      stats: { total, open, resolved },
      myWork,
      projects
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
  export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id

    const created = await Bug.countDocuments({ createdBy: userId })
    const assigned = await Bug.countDocuments({ assignedTo: userId })
    const resolved = await Bug.countDocuments({
      assignedTo: userId,
      status: "Resolved"
    })

    res.json({
      created,
      assigned,
      resolved
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getTeamOverview = async (req, res) => {
  try {
    const users = await User.find().select("name role")

    const result = []

    for (let user of users) {
      const total = await Bug.countDocuments({
        $or: [
          { assignedTo: user._id },
          { createdBy: user._id }
        ]
      })

      const resolved = await Bug.countDocuments({
        assignedTo: user._id,
        status: "Resolved"
      })

      result.push({
        _id: user._id,
        name: user.name,
        role: user.role,
        total,
        resolved
      })
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}