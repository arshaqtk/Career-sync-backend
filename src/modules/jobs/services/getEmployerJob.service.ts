import { jobRepository } from "../repository/job.repository"

export const getEmployerJobService = async (recruiterId: string, query: JobQuery) => {

  const { page, limit, location, jobType, status, search } = query;
  const filter: any = { postedBy: recruiterId }
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  console.log(filter)

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType && jobType !== "all") { 
    filter.jobType = jobType;
  }

  if (status && status !== "all") { 
    filter.status = status;
  }

  const jobs = await jobRepository.findByQuery(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit).lean();

  const total = await jobRepository.countByQuery(filter);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }, jobs
  }
}