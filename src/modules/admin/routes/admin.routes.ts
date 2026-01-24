import { catchAsync } from "../../../middlewares/asyncHandler";
import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { adminDashboardStats, getAdminDashboardData } from "../controllers/adminDasboard.controller";
import { adminGetRecruiters, blockRecruiterByAdminController, getAdminRecruiterDetailController, unblockRecruiterByAdminController } from "../controllers/adminRecruters.controller";
import { adminGetCandidates, blockCandidateByAdminController, getAdminCandidateDetailController, unblockCandidateByAdminController } from "../controllers/adminCandidates.controller";
import { adminBlockJob, adminGetJobDetail, adminGetJobs, adminUnblockJob } from "../controllers/adminJobs.controller";

const router=Router()

router.get("/stats",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminDashboardStats));
router.get("/dashboard",requireauthMiddleware,authorizeRoles("admin"),catchAsync(getAdminDashboardData));



router.get("/recruiters",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminGetRecruiters));
router.get("/recruiters/:recruiterId",requireauthMiddleware,authorizeRoles("admin"),catchAsync(getAdminRecruiterDetailController));
router.patch("/recruiters/:recruiterId/block",requireauthMiddleware,authorizeRoles("admin"),catchAsync(blockRecruiterByAdminController));
router.patch("/recruiters/:recruiterId/unblock",requireauthMiddleware,authorizeRoles("admin"),catchAsync(unblockRecruiterByAdminController));



router.get("/candidates",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminGetCandidates));
router.get("/candidates/:candidateId",requireauthMiddleware,authorizeRoles("admin"),catchAsync(getAdminCandidateDetailController));
router.patch("/candidates/:candidateId/block",requireauthMiddleware,authorizeRoles("admin"),catchAsync(blockCandidateByAdminController));
router.patch("/candidates/:candidateId/unblock",requireauthMiddleware,authorizeRoles("admin"),catchAsync(unblockCandidateByAdminController));


router.get("/jobs",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminGetJobs));
router.get("/jobs/:id",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminGetJobDetail));
router.patch("/jobs/:id/block",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminBlockJob));
router.patch("/jobs/:id/unblock",requireauthMiddleware,authorizeRoles("admin"),catchAsync(adminUnblockJob));




 
export default router;