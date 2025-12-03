import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { upload } from "../../../middlewares/upload";

const router=Router();
router.get("/profile",authMiddleware,UserController.getProfile)
router.put("/update-profile",authMiddleware,UserController.updateUserProfile)
router.put("/update-profile-avatar",authMiddleware,upload.single("image"),UserController.updateuserAvatar)


export default router 