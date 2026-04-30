import express from "express"
import protect from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
import { createProject,getProjects} from "../controllers/projectController.js"
import { addMember,removeMember } from "../controllers/projectController.js"
import { getProjectById } from "../controllers/projectController.js"
import {updateProjectStatus,deleteProject} from "../controllers/projectController.js"
import {adminOnly} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",protect,authorizeRoles("Admin"),createProject)
router.get("/",protect,getProjects)
router.put("/:id/add-member",protect,addMember)
router.put("/:id/remove-member",protect,removeMember)
router.get("/:id",protect,getProjectById)
router.put("/:id/status",protect,updateProjectStatus)
// router.put("/projects/status/:id",adminOnly,updateProjectStatus)
router.delete("/:id",protect,deleteProject)

export default router