import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { addCandidateProfileExperienceController, updateCandidateProfileExperienceController } from "../controllers/candidateExperience.controller";
import { updateCandidateProfileSkill } from "../controllers/candidateSkill.controller";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { addCandidateEducationController, updateCandidateEducationController } from "../controllers/candidateEducation.controller";
import { upload } from "../../../middlewares/upload";
import { updateResumeController } from "../controllers/candidateResume.controller";
import { ensureUserIsActive } from "../../../middlewares/ensureUserIsActive.middleware";

const router=Router();
// router.put("/update-profile-about",authMiddleware,UserController.updateUserProfileAbout)
router.use(authMiddleware)
router.use(ensureUserIsActive)
router.post("/profile/experience",authorizeRoles("candidate"),addCandidateProfileExperienceController)
router.put("/profile/experience/:id",authorizeRoles("candidate"),updateCandidateProfileExperienceController)
router.put("/profile/skill",authorizeRoles("candidate"),updateCandidateProfileSkill) 
router.post("/profile/education",authorizeRoles("candidate"),addCandidateEducationController)
router.put("/profile/education/:id",authorizeRoles("candidate"),updateCandidateEducationController)
router.put("/profile/resume",upload.single("resume"),updateResumeController)



export default router   