import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { candidateGetInterviewDetailController, candidateGetInterviewsController, recruiterFinalizeCandidateController, recruiterGetInterviewByIdController, recruiterGetInterviewsByApplicationController, recruiterGetInterviewsController, recruiterScheduleInterviewController, recruiterUpdateInterviewStatusController } from "../controllers/interview.controller";

const router=Router();


router.get("/recruiter/interviews",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewsController))
router.get("/recruiter/applications/:applicationId/interviews",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewsByApplicationController))
router.get("/recruiter/interviews/:interviewId",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewByIdController))
router.post("/recruiter/interviews/:applicationId/schedule",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterScheduleInterviewController))
router.post("/recruiter/interviews/:applicationId/nextround",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterScheduleInterviewController))
router.patch("/recruiter/interviews/:interviewId/status",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterUpdateInterviewStatusController))
router.post("/recruiter/interviews/:applicationId/finalize",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterFinalizeCandidateController))


router.get("/candidate/interviews",authMiddleware,authorizeRoles("candidate"),catchAsync(candidateGetInterviewsController))
router.get("/candidate/interviews/:interviewId",authMiddleware,authorizeRoles("candidate"),catchAsync(candidateGetInterviewDetailController))

export default router