import { Request, Response, NextFunction } from "express";
import { CompanyService } from "../services/company.service";
import { CustomError } from "../../../shared/utils/customError";

// 1. Create Company
export const createCompanyController = async (req: Request, res: Response) => {
    const { id: recruiterId } = (req as any).auth;
    const company = await CompanyService.createCompany(recruiterId, req.body);
    res.status(201).json({ success: true, message: "Company created. Waiting for admin approval.", data: company });
};

// 2. Get My Company
export const getMyCompanyController = async (req: Request, res: Response) => {
    const { id: recruiterId } = (req as any).auth;
    const company = await CompanyService.getCompanyByRecruiter(recruiterId);

    // If null, it means recruiter has no company linked or company not found.
    // User flow: "Recruiter only -> Fetch recruiter -> Get companyId -> Populate -> Response"
    // If no company, return 404 or empty data?
    // User provided API response for create, not for get.
    // Assuming standard response.
    if (!company) {
        return res.status(404).json({ success: false, message: "No company found for this recruiter" });
    }

    res.status(200).json({ success: true, data: company });
};

// 3. Update Company
export const updateCompanyController = async (req: Request, res: Response) => {
    const { id: recruiterId } = (req as any).auth;
    const { id: companyId } = req.params;
    const company = await CompanyService.updateCompany(recruiterId, companyId, req.body);
    res.status(200).json({ success: true, message: "Company updated successfully", data: company });
};

// 4. Admin - Approve
export const adminApproveCompanyController = async (req: Request, res: Response) => {
    const { id: adminId } = (req as any).auth;
    const { id: companyId } = req.params;
    const company = await CompanyService.approveCompany(adminId, companyId);
    res.status(200).json({ success: true, message: "Company approved", data: company });
};

// 5. Admin - Reject
export const adminRejectCompanyController = async (req: Request, res: Response) => {
    const { id: adminId } = (req as any).auth;
    const { id: companyId } = req.params;
    const company = await CompanyService.rejectCompany(adminId, companyId);
    res.status(200).json({ success: true, message: "Company rejected", data: company });
};

// 6. Admin - Block
export const adminBlockCompanyController = async (req: Request, res: Response) => {
    const { id: companyId } = req.params;
    const { reason } = req.body;
    const company = await CompanyService.blockCompany(companyId, reason);
    res.status(200).json({ success: true, message: "Company blocked", data: company });
};


// 7. Search Companies
export const searchCompaniesController = async (req: Request, res: Response) => {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, message: "Query string is required" });
    }
    const companies = await CompanyService.searchCompanies(query);
    res.status(200).json({ success: true, data: companies });
};

// 8. Join Company
export const joinCompanyController = async (req: Request, res: Response) => {
    const { id: recruiterId } = (req as any).auth;
    const { companyId } = req.body;

    if (!companyId) {
        return res.status(400).json({ success: false, message: "Company ID is required" });
    }

    const company = await CompanyService.joinCompany(recruiterId, companyId);
    res.status(200).json({ success: true, message: "Successfully joined company", data: company });
};

// 9. Get Company By ID
export const getCompanyByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await CompanyService.getCompanyById(id);
    res.status(200).json({ success: true, data: company });
};