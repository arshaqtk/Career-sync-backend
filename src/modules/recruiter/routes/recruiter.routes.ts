import { Router } from "express";
import { getCandidateProfileController, getRecruiterProfileStats } from "../controllers/getCandidateProfile.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { catchAsync } from "../../../middlewares/asyncHandler";
import { ensureUserIsActive } from "../../../middlewares/ensureUserIsActive.middleware";



 const router=Router()
router.use(authMiddleware)
router.use(ensureUserIsActive)
router.get("/candidates/:candidateId",authorizeRoles("recruiter"),catchAsync(getCandidateProfileController))
router.get("/profile/stats",authorizeRoles("recruiter"),catchAsync(getRecruiterProfileStats))
export default router