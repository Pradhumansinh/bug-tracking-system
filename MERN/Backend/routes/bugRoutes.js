import express from "express"
import { createBug,getBugs,getBugById,updateBug,deleteBug,assignBug,updateBugStatus, getDashboardStats } from "../controllers/bugController.js"
import protect from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
import {getProjectDashboard} from "../controllers/bugController.js"
import { getBugsByProject } from "../controllers/bugController.js"
import upload from "../middleware/upload.js"
import {addComment,editComment,deleteComment} from "../controllers/bugController.js"

const router = express.Router()

router.post("/",protect,authorizeRoles("Tester","Admin"),upload.single("image"),createBug)
router.get("/",protect,getBugs)
router.get("/stats",protect,getDashboardStats)
router.get("/project/:id/bugs",protect,getBugsByProject)
router.get("/:id",protect,getBugById)
router.put("/:id",protect,authorizeRoles("Developer","Admin"),updateBug)
router.delete("/:id",protect,authorizeRoles("Admin"),deleteBug)
router.put("/assign/:id",protect,authorizeRoles("Admin"),assignBug)
router.put("/status/:id",protect,authorizeRoles("Developer","Admin"),updateBugStatus)
router.get("/project/:id",protect,getProjectDashboard)
router.post("/:id/comment",protect,addComment)
router.put("/:bugId/comment/:commentId",protect,editComment)
router.delete("/:bugId/comment/:commentId",protect,deleteComment)




export default router