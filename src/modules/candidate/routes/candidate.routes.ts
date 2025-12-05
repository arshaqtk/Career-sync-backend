import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { updateCandidateProfileExperience } from "../controllers/candidateExperience.controller";

const router=Router();
// router.put("/update-profile-about",authMiddleware,UserController.updateUserProfileAbout)
router.put("/profile/experience",authMiddleware,updateCandidateProfileExperience)


export default router 