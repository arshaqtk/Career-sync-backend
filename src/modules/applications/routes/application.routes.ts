import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { applyToJob, getApplicantDetailsController, getApplicationController, getApplicationsByJobController, getMyApplicationsController, getRecruiterApplicationsController, updateApplicationStatusController } from "../controllers/application.controller";
import { catchAsync } from "../../../middlewares/asyncHandler";
import { authorizeRoles } from "../../../middlewares/role.middleware";

const router=Router();

router.post("/apply",authMiddleware,catchAsync(applyToJob))
router.get("/my",authMiddleware,catchAsync(getMyApplicationsController))
router.get("/my/:applicationId",authMiddleware,catchAsync(getApplicationController))


//recruiter
router.get("/recruiter",authMiddleware,authorizeRoles("recruiter"),getRecruiterApplicationsController);
router.get("/job/:jobId",authMiddleware,authorizeRoles("recruiter"),catchAsync(getApplicationsByJobController))
router.patch( "/:applicationId/status",authMiddleware,authorizeRoles("recruiter"),catchAsync(updateApplicationStatusController));
router.get("/:applicationId",catchAsync(getApplicantDetailsController))
// router.get("/:applicationId/resume/download")
export default router