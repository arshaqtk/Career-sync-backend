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
    getCompanyByIdController} from "../controllers/createCompany.controller";

const router = Router();

// 1. Create Company
router.post( "/",requireauthMiddleware, authorizeRoles("recruiter"), catchAsync(createCompanyController));

// Get Company By ID
router.get("/:id",requireauthMiddleware,catchAsync(getCompanyByIdController));

// 2. Get My Company
router.get("/me",requireauthMiddleware,authorizeRoles("recruiter"),catchAsync(getMyCompanyController));

// Search Companies
router.get("/search",requireauthMiddleware,authorizeRoles("recruiter"),catchAsync(searchCompaniesController));

// Join Company
router.post("/join",requireauthMiddleware,authorizeRoles("recruiter"),catchAsync(joinCompanyController));

// 3. Update Company
router.patch("/:id",requireauthMiddleware,authorizeRoles("recruiter"),catchAsync(updateCompanyController));

export default router;
