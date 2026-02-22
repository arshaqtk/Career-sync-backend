import { Types } from "mongoose";
import { jobRepository } from "../repository/job.repository";
import { CompanyModel } from "@/modules/company/models/company.model";
import { IJob } from "../types/JobModel.type";

export const addJobService = async (
  data: IJob,
  userId: string
) => {
  console.log(data)

  const company = await CompanyModel.findOne({
    $or: [
      { owner: userId },
      { recruiters: userId }
    ],
    isActive: true,
    verificationStatus: "approved"
  }).lean();

  if (!company) {
    throw new Error("No associated approved company found for this recruiter");
  }


  data.company = company._id;

  data.postedBy = new Types.ObjectId(userId);
  return jobRepository.createJob(data);
};