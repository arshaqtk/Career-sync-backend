import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { upload } from "../../../middlewares/upload";

const router=Router();
router.get("/profile",authMiddleware,UserController.getProfile)
router.put("/update-profile-basic",authMiddleware,UserController.updateUserProfileBasic)
router.put("/update-profile-about",authMiddleware,UserController.updateUserProfileAbout)
// router.put("/update-profile-experience",authMiddleware,UserController.updateUserProfileExperience)
router.put("/update-profile-avatar",authMiddleware,upload.single("profilePicture"),UserController.updateuserAvatar)


export default router 