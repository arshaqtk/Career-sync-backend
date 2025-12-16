import { Router } from "express";
import { getCandidateProfileController } from "../controllers/getCandidateProfile.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { catchAsync } from "../../../middlewares/asyncHandler";



 const router=Router()

router.get("/candidates/:candidateId",authMiddleware,authorizeRoles("recruiter"),catchAsync(getCandidateProfileController))


export default router