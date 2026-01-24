import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { Router } from "express";
import { applyToJob, getApplicantDetailsController, getApplicationController, getApplicationsByJobController, getMyApplicationsController, getRecruiterApplicationsController, updateApplicationStatusController } from "../controllers/application.controller";
import { catchAsync } from "../../../middlewares/asyncHandler";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { ensureUserIsActive } from "../../../middlewares/ensureUserIsActive.middleware";

const router=Router();
router.use(requireauthMiddleware)
router.use(ensureUserIsActive)
router.post("/apply",catchAsync(applyToJob))
router.get("/my",catchAsync(getMyApplicationsController))
router.get("/my/:applicationId",catchAsync(getApplicationController))


//recruiter
router.get("/recruiter",authorizeRoles("recruiter"),getRecruiterApplicationsController);
router.get("/job/:jobId",authorizeRoles("recruiter"),catchAsync(getApplicationsByJobController))
router.get("/:applicationId",authorizeRoles("recruiter"),catchAsync(getApplicantDetailsController))
router.patch( "/:applicationId/status",authorizeRoles("recruiter"),catchAsync(updateApplicationStatusController));
// router.get("/:applicationId/resume/download")
export default router