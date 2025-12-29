import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { adminDashboardStats } from "../controllers/adminDasboard.controller";
import { adminGetRecruiters, blockRecruiterByAdminController, getAdminRecruiterDetailController, unblockRecruiterByAdminController } from "../controllers/adminRecruters.controller";
import { adminGetCandidates, blockCandidateByAdminController, getAdminCandidateDetailController, unblockCandidateByAdminController } from "../controllers/adminCandidates.controller";

const router=Router()

router.get("/stats",authMiddleware,authorizeRoles("admin"),catchAsync(adminDashboardStats));


router.get("/recruiters",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetRecruiters));
router.get("/recruiters/:recruiterId",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminRecruiterDetailController));
router.patch("/recruiters/:recruiterId/block",authMiddleware,authorizeRoles("admin"),catchAsync(blockRecruiterByAdminController));
router.patch("/recruiters/:recruiterId/unblock",authMiddleware,authorizeRoles("admin"),catchAsync(unblockRecruiterByAdminController));



router.get("/candidates",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetCandidates));
router.get("/candidates/:candidateId",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminCandidateDetailController));
router.patch("/candidates/:candidateId/block",authMiddleware,authorizeRoles("admin"),catchAsync(blockCandidateByAdminController));
router.patch("/candidates/:candidateId/unblock",authMiddleware,authorizeRoles("admin"),catchAsync(unblockCandidateByAdminController));






export default router;