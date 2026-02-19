import { Types, Document } from "mongoose";
import { CompanyModel } from "../models/company.model";
import { UserRepository } from "../../../modules/user/repository/user.repository";
import { ICompany } from "../types/company.types";
import { CustomError } from "../../../shared/utils/customError";

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
            verificationStatus: "pending",
            isActive: true,
        });

        // 5. Link recruiter to company
        await UserRepository.updateById(recruiterId, { "recruiterData.company": company._id });

        return company;
    },

    getCompanyByRecruiter: async (recruiterId: string) => {
        const recruiter = await UserRepository.findById(recruiterId).populate("recruiterData.company");
        if (!recruiter) throw new CustomError("Recruiter not found", 404);

        const company = recruiter.recruiterData?.company as unknown as (ICompany & Document) | null;
        return company;
    },

    getCompanyById: async (companyId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);
        return company;
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

    searchCompanies: async (query: string) => {
        // Search by name, case-insensitive
        // Only return active and verified companies for joining?
        // Or maybe just active ones. Let's return minimal fields.
        const companies = await CompanyModel.find({
            name: { $regex: query, $options: "i" },
            isActive: true, // Only show active companies
            verificationStatus: "approved" // Only show approved companies? Or maybe pending too? Likely approved to join.
        }).select("name logo location industry size");

        return companies;
    },

    joinCompany: async (recruiterId: string, companyId: string) => {
        const company = await CompanyModel.findById(companyId);
        if (!company) throw new CustomError("Company not found", 404);

        // Check if already linked
        if (company.recruiters.some(id => id.toString() === recruiterId)) {
            throw new CustomError("You are already a recruiter for this company", 400);
        }

        // Add to company recruiters
        company.recruiters.push(new Types.ObjectId(recruiterId));
        await company.save();

        // Update user
        await UserRepository.updateById(recruiterId, { "recruiterData.company": company._id });

        return company;
    },
};
