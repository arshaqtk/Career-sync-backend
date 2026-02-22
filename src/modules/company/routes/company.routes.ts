import { Router } from "express";
import { catchAsync } from "../../../middlewares/asyncHandler";
import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import {
    createCompanyController,
    getMyCompanyController,
    updateCompanyController,
    searchCompaniesController,
    joinCompanyController,
    getCompanyByIdController,
    getCompanyJobsController,
    getPendingRecruitersController,
    approveRecruiterController,
    rejectRecruiterController
} from "../controllers/createCompany.controller";

const router = Router();

// 1. Create Company
router.post("/", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(createCompanyController));

// 2. Get My Company  (static routes MUST come before /:id)
router.get("/me", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(getMyCompanyController));

// Search Companies
router.get("/search", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(searchCompaniesController));

// Join Company
router.post("/join", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(joinCompanyController));

// --- Recruiter Management (Owner Only) ---
router.get("/:id/pending-recruiters", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(getPendingRecruitersController));
router.post("/:id/approve-recruiter", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(approveRecruiterController));
router.post("/:id/reject-recruiter", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(rejectRecruiterController));

// Dynamic param routes — AFTER all static routes
router.get("/:id", requireauthMiddleware, catchAsync(getCompanyByIdController));
router.get("/:id/jobs", requireauthMiddleware, catchAsync(getCompanyJobsController));

// 3. Update Company
router.patch("/:id", requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(updateCompanyController));

export default router;
