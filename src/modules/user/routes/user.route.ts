import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ensureUserIsActive } from "../../../middlewares/ensureUserIsActive.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { ImageUpload } from "../../../middlewares/imageUpload.middleware";

const router=Router();
router.use(requireauthMiddleware)
router.use(ensureUserIsActive)
router.get("/online",UserController.getOnlineUsers)
router.get("/profile",UserController.getProfile)
router.put("/update-profile-basic",UserController.updateUserProfileBasic)
router.put("/update-profile-about",UserController.updateUserProfileAbout)
// router.put("/update-profile-experience",UserController.updateUserProfileExperience)
router.put("/update-profile-avatar",ImageUpload.single("image"),UserController.updateuserAvatar)
router.put("/company",authorizeRoles("recruiter"),UserController.updateRecruiterCompany)




export default router 