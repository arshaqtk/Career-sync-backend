import { Types, Document } from "mongoose";
import { CompanyModel } from "../models/company.model";
import { UserRepository } from "../../../modules/user/repository/user.repository";
import { ICompany } from "../types/company.types";
import { CustomError } from "../../../shared/utils/customError";
import { JobModel } from "../../jobs/models/job.model";

export const CompanyService = {
    createCompany: async (recruiterId: string, data: Partial<ICompany>) => {
        // 1. Check recruiter exists
        const recruiter = await UserRepository.findById(recruiterId);
        if (!recruiter) throw new CustomError("Recruiter not found", 404);
        if (recruiter.role !== "recruiter") throw new CustomError("Only recruiters can create a company", 403);

        // 2. Check if already linked
        if (recruiter.recruiterData?.company) {
            throw new CustomError("Recruiter already linked to a company", 400);
        }

        // 3. Check duplicate name (case-insensitive)
        const existingCompany = await CompanyModel.findOne({
            name: { $regex: `^${data.name}$`, $options: "i" },
        });
        if (existingCompany) {
            throw new CustomError("Company with this name already exists", 400);
        }

        // 4. Create company
        const company = await CompanyModel.create({
            ...data,
            owner: new Types.ObjectId(recruiterId),
            recruiters: [new Types.ObjectId(recruiterId)],
            pendingRecruiters: [],
            verificationStatus: "pending",
            isActive: true,
        });

        // 5. Link recruiter to company and set as approved
        await UserRepository.updateById(recruiterId, {
            "recruiterData.company": company._id,
            "recruiterData.companyApprovalStatus": "approved"
        });

        return company;
    },

    getCompanyByRecruiter: async (recruiterId: string) => {
        const recruiter = await UserRepository.findById(recruiterId).populate("recruiterData.company");
        if (!recruiter) throw new CustomError("Recruiter not found", 404);

        const company = recruiter.recruiterData?.company as unknown as (ICompany & Document) | null;
        return company;
    },

    getCompanyById: async (companyId: string) => {
        const company = await CompanyModel.findById(companyId)
            .populate("owner", "name email profilePictureUrl")
            .populate("recruiters", "name email profilePictureUrl")
            .populate("pendingRecruiters", "name email profilePictureUrl");
        if (!company) throw new CustomError("Company not found", 404);
        return company;
    },

    getCompanyJobs: async (companyId: string) => {
        return JobModel.find({
            company: new Types.ObjectId(companyId)
        }).sort({ createdAt: -1 });
    },

    updateCompany: async (recruiterId: string, companyId: string, updates: Partial<ICompany>) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        // Only owner can update
        if (company.owner.toString() !== recruiterId) {
            throw new CustomError("Only the owner can update the company profile", 403);
        }

        // Restricted fields
        delete updates.verificationStatus;
        delete updates.owner;
        delete updates.recruiters;
        delete (updates as any).pendingRecruiters;
        delete updates.verifiedAt;
        delete updates.verifiedBy;
        delete updates.blockedAt;
        delete updates.isActive;

        Object.assign(company, updates);
        await company.save();
        return company;
    },

    approveCompany: async (adminId: string, companyId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        company.verificationStatus = "approved";
        company.verifiedAt = new Date();
        company.verifiedBy = new Types.ObjectId(adminId);
        await company.save();
        return company;
    },

    rejectCompany: async (adminId: string, companyId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        company.verificationStatus = "rejected";
        company.verifiedAt = new Date();
        company.verifiedBy = new Types.ObjectId(adminId);
        await company.save();
        return company;
    },

    blockCompany: async (companyId: string, reason: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        company.isActive = false;
        company.blockedAt = new Date();
        company.blockReason = reason;
        await company.save();
        return company;
    },

    unblockCompany: async (companyId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        company.isActive = true;
        company.blockedAt = undefined;
        company.blockReason = undefined;
        await company.save();
        return company;
    },

    searchCompanies: async (query: string) => {
        // Search by name, case-insensitive
        const companies = await CompanyModel.find({
            name: { $regex: query, $options: "i" },
            isActive: true,
            verificationStatus: "approved"
        }).select("name logo location industry size");

        return companies;
    },

    joinCompany: async (recruiterId: string, companyId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        // Check if already in recruiters or pending
        if (company.recruiters.some(id => id.toString() === recruiterId) ||
            company.pendingRecruiters.some(id => id.toString() === recruiterId)) {
            throw new CustomError("You have already joined or requested to join this company", 400);
        }

        // Add to pending recruiters
        company.pendingRecruiters.push(new Types.ObjectId(recruiterId));
        await company.save();

        // Update user status
        await UserRepository.updateById(recruiterId, {
            "recruiterData.company": company._id,
            "recruiterData.companyApprovalStatus": "pending"
        });

        return company;
    },

    approveRecruiter: async (ownerId: string, companyId: string, recruiterId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        if (company.owner.toString() !== ownerId) {
            throw new CustomError("Only the company owner can approve recruiters", 403);
        }

        // 1. Remove from pending
        const index = company.pendingRecruiters.findIndex(id => id.toString() === recruiterId);
        if (index === -1) throw new CustomError("Recruiter not found in pending list", 404);
        company.pendingRecruiters.splice(index, 1);

        // 2. Add to approved
        company.recruiters.push(new Types.ObjectId(recruiterId));
        await company.save();

        // 3. Update user
        await UserRepository.updateById(recruiterId, {
            "recruiterData.companyApprovalStatus": "approved"
        });

        return company;
    },

    rejectRecruiter: async (ownerId: string, companyId: string, recruiterId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        if (company.owner.toString() !== ownerId) {
            throw new CustomError("Only the company owner can reject recruiters", 403);
        }

        // 1. Remove from pending
        const index = company.pendingRecruiters.findIndex(id => id.toString() === recruiterId);
        if (index === -1) throw new CustomError("Recruiter not found in pending list", 404);
        company.pendingRecruiters.splice(index, 1);

        await company.save();

        // 2. Update user status and remove company link?
        // Let's remove the link so they can try again or join elsewhere
        await UserRepository.updateById(recruiterId, {
            "recruiterData.company": undefined,
            "recruiterData.companyApprovalStatus": undefined
        });

        return company;
    },

    getPendingRecruiters: async (ownerId: string, companyId: string) => {
        const company = await CompanyModel.findById(companyId).populate("pendingRecruiters", "name email profilePicture");
        if (!company) throw new CustomError("Company not found", 404);

        if (company.owner.toString() !== ownerId) {
            throw new CustomError("Only the company owner can view pending recruiters", 403);
        }

        return company.pendingRecruiters;
    },

    adminGetCompanies: async ({
        page = 1,
        limit = 10,
        search = "",
        verificationStatus = "all",
        isActive = "all"
    }: {
        page?: number;
        limit?: number;
        search?: string;
        verificationStatus?: "pending" | "approved" | "rejected" | "all";
        isActive?: "true" | "false" | "all";
    }) => {
        const query: any = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (verificationStatus !== "all") {
            query.verificationStatus = verificationStatus;
        }

        if (isActive !== "all") {
            query.isActive = isActive === "true";
        }

        const skip = (page - 1) * limit;

        const [companies, total] = await Promise.all([
            CompanyModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("owner", "name email"),
            CompanyModel.countDocuments(query)
        ]);

        return {
            companies,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
};
