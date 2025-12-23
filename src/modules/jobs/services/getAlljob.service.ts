import { UserRepository } from "../../../modules/user/repository/user.repository";
import { jobRepository } from "../repository/job.repository";

export const CandidategetJobsService = async (
  candidateId: string,
  query: JobQuery
) => {
  const { page, limit, location, jobType, status, search } = query;
console.log(search)
  const candidate = await UserRepository
    .findById(candidateId)
    .select("field skills");

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  const filter: any = {
    field: candidate.field, 
  };

  if (candidate.candidateData?.skills?.length) {
    filter.skillsRequired = { $in: candidate.candidateData.skills };
  }

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

  const jobs = await jobRepository.findByQuery(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await jobRepository.countByQuery(filter);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    jobs,
  };
};
