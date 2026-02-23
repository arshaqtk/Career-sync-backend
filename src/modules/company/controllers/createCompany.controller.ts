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
    if (!company) {
        return res.status(404).json({ success: false, message: "No company found for this recruiter" });
    }
    res.status(200).json({ success: true, data: company });
};

export const getCompanyJobsController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const jobs = await CompanyService.getCompanyJobs(id);
    res.status(200).json({ success: true, data: jobs });
}

// 3. Update Company
export const updateCompanyController = async (req: Request, res: Response) => {
    const { id: recruiterId } = (req as any).auth;
    const companyId = req.params.id as string;
    const company = await CompanyService.updateCompany(recruiterId, companyId, req.body);
    res.status(200).json({ success: true, message: "Company updated successfully", data: company });
};

export const adminGetCompaniesController = async (req: Request, res: Response) => {
    const { page, limit, search, verificationStatus, isActive } = req.query;
    const result = await CompanyService.adminGetCompanies({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        verificationStatus: verificationStatus as any,
        isActive: isActive as any
    });
    res.status(200).json({ success: true, data: result });
};
// 4. Admin - Approve
export const adminApproveCompanyController = async (req: Request, res: Response) => {
    const { id: adminId } = (req as any).auth;
    const companyId = req.params.id as string;
    const company = await CompanyService.approveCompany(adminId, companyId);
    res.status(200).json({ success: true, message: "Company approved", data: company });
};

// 5. Admin - Reject
export const adminRejectCompanyController = async (req: Request, res: Response) => {
    const { id: adminId } = (req as any).auth;
    const companyId = req.params.id as string;
    const company = await CompanyService.rejectCompany(adminId, companyId);
    res.status(200).json({ success: true, message: "Company rejected", data: company });
};

// 6. Admin - Block
export const adminBlockCompanyController = async (req: Request, res: Response) => {
    const companyId = req.params.id as string;
    const { reason } = req.body;
    const company = await CompanyService.blockCompany(companyId, reason);
    res.status(200).json({ success: true, message: "Company blocked", data: company });
};

// 6.1 Admin - Unblock
export const adminUnblockCompanyController = async (req: Request, res: Response) => {
    const companyId = req.params.id as string;
    const company = await CompanyService.unblockCompany(companyId);
    res.status(200).json({ success: true, message: "Company unblocked", data: company });
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
    res.status(200).json({ success: true, message: "Join request sent. Waiting for company owner approval.", data: company });
};

// 9. Get Company By ID
export const getCompanyByIdController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const company = await CompanyService.getCompanyById(id);
    res.status(200).json({ success: true, data: company });
};

// 10. Recruiter Management
export const getPendingRecruitersController = async (req: Request, res: Response) => {
    const { id: ownerId } = (req as any).auth;
    const companyId = req.params.id as string;
    const pending = await CompanyService.getPendingRecruiters(ownerId, companyId);
    res.status(200).json({ success: true, data: pending });
};

export const approveRecruiterController = async (req: Request, res: Response) => {
    const { id: ownerId } = (req as any).auth;
    const companyId = req.params.id as string;
    const { recruiterId } = req.body;
    const company = await CompanyService.approveRecruiter(ownerId, companyId, recruiterId);
    res.status(200).json({ success: true, message: "Recruiter approved successfully", data: company });
};

export const rejectRecruiterController = async (req: Request, res: Response) => {
    const { id: ownerId } = (req as any).auth;
    const companyId = req.params.id as string;
    const { recruiterId } = req.body;
    const company = await CompanyService.rejectRecruiter(ownerId, companyId, recruiterId);
    res.status(200).json({ success: true, message: "Recruiter request rejected", data: company });
};