import express from "express"
import {createUser} from  "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"

import {getUsers} from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"
import {adminOnly} from "../middleware/authMiddleware.js"
import {allowRoles} from "../middleware/roleMiddleware.js"
import { updateUserRole } from "../controllers/userController.js"
import { forgotPassword,resetPassword } from "../controllers/userController.js"
import {deleteUser} from "../controllers/userController.js"
import {getUserStats} from "../controllers/userController.js"
import {getProfile} from "../controllers/userController.js"
import { getTeamOverview } from "../controllers/userController.js"

const router = express.Router()

router.post("/create",createUser)
router.get("/",authMiddleware,getUsers)
router.get("/profile",protect,getProfile)
router.get("/admin-only",
    authMiddleware,
    roleMiddleware("Admin"),
    (req,res)=>{
        res.json({
            message:"Welcome Admin"
        })
    }
)
router.put("/role/:id",protect,allowRoles("Admin"),updateUserRole)
router.post("/forgot-password",forgotPassword)
router.put("/reset-password/:token",resetPassword)
router.delete("/:id",protect,adminOnly,deleteUser)
router.get("/team-overview",protect,allowRoles("Admin"),getTeamOverview)
router.get("/profile-stats",protect,getUserStats)

// update profile
router.put("/update-profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    await user.save()

    res.json({
      message: "Profile updated",
      user
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put("/change-password", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const { currentPassword, newPassword } = req.body

    const isMatch = await user.matchPassword(currentPassword)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router;