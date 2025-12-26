import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { candidateGetInterviewDetailController, candidateGetInterviewsController, recruiterFinalizeCandidateController, recruiterGetInterviewByIdController, recruiterGetInterviewsByApplicationController, recruiterGetInterviewsController, recruiterScheduleInterviewController, recruiterUpdateInterviewStatusController } from "../controllers/interview.controller";
import { ensureUserIsActive } from "../../../middlewares/ensureUserIsActive.middleware";

const router=Router();
router.use(authMiddleware)
router.use(ensureUserIsActive)

router.get("/recruiter/interviews",authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewsController))
router.get("/recruiter/applications/:applicationId/interviews",authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewsByApplicationController))
router.get("/recruiter/interviews/:interviewId",authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewByIdController))
router.post("/recruiter/interviews/:applicationId/schedule",authorizeRoles("recruiter"),catchAsync(recruiterScheduleInterviewController))
router.post("/recruiter/interviews/:applicationId/nextround",authorizeRoles("recruiter"),catchAsync(recruiterScheduleInterviewController))
router.patch("/recruiter/interviews/:interviewId/status",authorizeRoles("recruiter"),catchAsync(recruiterUpdateInterviewStatusController))
router.post("/recruiter/interviews/:applicationId/finalize",authorizeRoles("recruiter"),catchAsync(recruiterFinalizeCandidateController))


router.get("/candidate/interviews",authorizeRoles("candidate"),catchAsync(candidateGetInterviewsController))
router.get("/candidate/interviews/:interviewId",authorizeRoles("candidate"),catchAsync(candidateGetInterviewDetailController))

export default router