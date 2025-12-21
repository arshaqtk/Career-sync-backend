import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { candidateGetInterviewsCOntroller, recruiterGetInterviewByIdController, recruiterGetInterviewsController, recruiterScheduleInterviewController, recruiterUpdateInterviewStatusController } from "../controllers/interview.controller";

const router=Router();


router.get("/recruiter/interviews",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewsController))
router.get("/recruiter/interviews/:interviewId",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewByIdController))
router.post("/recruiter/interviews/:applicationId/schedule",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterScheduleInterviewController))
router.patch("/recruiter/interviews/:interviewId/status",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterUpdateInterviewStatusController))

router.get("/candidate/interviews",authMiddleware,authorizeRoles("candidate"),catchAsync(candidateGetInterviewsCOntroller))
export default router