import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Router } from "express";
import { adminDashboardStats } from "../controllers/adminDasboard.controller";
import { adminGetRecruiters, getAdminRecruiterDetailController } from "../controllers/adminRecruters.controller";
import { adminGetCandidates, getAdminCandidateDetailController } from "../controllers/adminCandidates.controller";

const router=Router()

router.get("/stats",authMiddleware,authorizeRoles("admin"),catchAsync(adminDashboardStats));
router.get("/recruiters",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetRecruiters));
router.get("/recruiters/:recruiterId",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminRecruiterDetailController));
router.get("/candidates",authMiddleware,authorizeRoles("admin"),catchAsync(adminGetCandidates));
router.get("/candidates/:candidateId",authMiddleware,authorizeRoles("admin"),catchAsync(getAdminCandidateDetailController));




export default router;