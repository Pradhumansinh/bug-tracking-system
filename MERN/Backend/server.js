import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import bugRoutes from "./routes/bugRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/bugs",bugRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/notifications",notificationRoutes)




app.get("/",(req,res)=>{
    res.send("API is running...")
})

const PORT= process.env.PORT || 5000;
app.listen(PORT,(req,res)=>{
    console.log(`Server running on port ${PORT}`)
})