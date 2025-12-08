import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { addCandidateProfileExperienceController, updateCandidateProfileExperienceController } from "../controllers/candidateExperience.controller";
import { updateCandidateProfileSkill } from "../controllers/candidateSkill.controller";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { addCandidateEducationController, updateCandidateEducationController } from "../controllers/candidateEducation.controller";

const router=Router();
// router.put("/update-profile-about",authMiddleware,UserController.updateUserProfileAbout)
router.post("/profile/experience",authMiddleware,authorizeRoles("candidate"),addCandidateProfileExperienceController)
router.put("/profile/experience/:id",authMiddleware,authorizeRoles("candidate"),updateCandidateProfileExperienceController)
router.put("/profile/skill",authMiddleware,authorizeRoles("candidate"),updateCandidateProfileSkill) 
router.post("/profile/education",authMiddleware,authorizeRoles("candidate"),addCandidateEducationController)
router.put("/profile/education/:id",authMiddleware,authorizeRoles("candidate"),updateCandidateEducationController)



export default router   