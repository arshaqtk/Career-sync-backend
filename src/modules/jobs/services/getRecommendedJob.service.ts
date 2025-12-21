import { UserRepository } from "@/modules/user/repository/user.repository";
import { JobModel } from "../models/job.model";

interface JobQuery {
  page: number;
  limit: number;
  location?: string;
  search?:string;
  jobType?: "full-time" | "part-time" | "internship" | "all";
  status?: "open" | "closed"  | "all";
}

export const CandidategetRecommendedJobsService = async (candidateId:string,query: JobQuery) => {
  const { page, limit, location, jobType,status,search } = query;
  const filter: any = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType && jobType !== "all") {
    filter.jobType = jobType;
  }

  if (status && status !== "all") {
    filter.status = status;
  }

  const userSkills=await UserRepository.findById(candidateId)

  const jobs = await JobModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await JobModel.countDocuments(filter);

  return {
    pagination:{ page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)},
    jobs,
  };
};