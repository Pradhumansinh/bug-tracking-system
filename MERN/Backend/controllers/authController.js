import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Notification from "../models/Notification.js"

 export const loginUser = async (req,res)=>{
     try{ if (!req.body){
        return res.status(400).json({
        message:"Request body missing"
    })}
    const {email,password}=req.body

    const user = await
     User.findOne({email})
    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    const isMatch = await 
    bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"})
    }

    const token = jwt.sign({ id: user._id,role:user.role },
        process.env.JWT_SECRET,{expiresIn:"1d"}
    )

    res.json({
        token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    })
}catch(error) {
    console.log(error)
    res.status(500).json({
        message:error.message
    })
}
 }

 export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

  

    // create user
    const user = await User.create({
      name,
      email,
      password,
      role:"Tester"
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
    const admins=await User.find({role:"Admin"})
    for(let admin of admins){
      await Notification.create({
        user:admin._id,
        message:`New user registered: ${user.name}`
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message,
    })
  }
}
