import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { recruiterGetInterviewByIdController, recruiterGetInterviewsController } from "../controllers/interview.controller";

const router=Router();


router.get("/recruiter/interviews",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewsController))
router.get("/recruiter/interviews/:interviewId",authMiddleware,authorizeRoles("recruiter"),catchAsync(recruiterGetInterviewByIdController))


export default router