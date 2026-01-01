import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { adminDashboardStats, getAdminDashboardData } from "../controllers/adminDasboard.controller";
import { adminGetRecruiters, blockRecruiterByAdminController, getAdminRecruiterDetailController, unblockRecruiterByAdminController } from "../controllers/adminRecruters.controller";
import { adminGetCandidates, blockCandidateByAdminController, getAdminCandidateDetailController, unblockCandidateByAdminController } from "../controllers/adminCandidates.controller";
import { adminBlockJob, adminGetJobDetail, adminGetJobs, adminUnblockJob } from "../controllers/adminJobs.controller";

const router=Router()

router.get("/stats",authMiddleware,authorizeRoles("admin"),catchAsync(adminDashboardStats));
router.get("/dashboard",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminDashboardData));



router.get("/recruiters",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetRecruiters));
router.get("/recruiters/:recruiterId",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminRecruiterDetailController));
router.patch("/recruiters/:recruiterId/block",authMiddleware,authorizeRoles("admin"),catchAsync(blockRecruiterByAdminController));
router.patch("/recruiters/:recruiterId/unblock",authMiddleware,authorizeRoles("admin"),catchAsync(unblockRecruiterByAdminController));



router.get("/candidates",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetCandidates));
router.get("/candidates/:candidateId",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminCandidateDetailController));
router.patch("/candidates/:candidateId/block",authMiddleware,authorizeRoles("admin"),catchAsync(blockCandidateByAdminController));
router.patch("/candidates/:candidateId/unblock",authMiddleware,authorizeRoles("admin"),catchAsync(unblockCandidateByAdminController));


router.get("/jobs",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetJobs));
router.get("/jobs/:id",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetJobDetail));
router.patch("/jobs/:id/block",authMiddleware,authorizeRoles("admin"),catchAsync(adminBlockJob));
router.patch("/jobs/:id/unblock",authMiddleware,authorizeRoles("admin"),catchAsync(adminUnblockJob));




 
export default router;