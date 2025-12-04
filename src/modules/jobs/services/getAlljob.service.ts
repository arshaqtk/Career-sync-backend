import { JobModel } from "../models/job.model";

interface JobQuery {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  jobType?: string;
}

export const getAllJobsService = async (query: JobQuery) => {
  const { page, limit, search, location, jobType } = query;

  const filter: any = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    filter.jobType = jobType;
  }
console.log(filter)
  const jobs = await JobModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await JobModel.countDocuments(filter);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    jobs,
  };
};