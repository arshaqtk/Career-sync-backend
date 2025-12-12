import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { applyToJob, getApplicationController, getApplicationsByJobController, getMyApplicationsController } from "../controllers/application.controller";
import { catchAsync } from "../../../middlewares/asyncHandler";
import { authorizeRoles } from "../../../middlewares/role.middleware";

const router=Router();

router.post("/apply",authMiddleware,catchAsync(applyToJob))
router.get("/my",authMiddleware,catchAsync(getMyApplicationsController))
router.get("/my/:id",authMiddleware,catchAsync(getApplicationController))


//recruiter

router.get("/job/:jobId",authMiddleware,authorizeRoles("recruiter"),catchAsync(getApplicationsByJobController))
// router.put("/status/:id")
router.get("/:applicationId",getApplicationController)
// router.get("/:applicationId/resume/download")
export default router