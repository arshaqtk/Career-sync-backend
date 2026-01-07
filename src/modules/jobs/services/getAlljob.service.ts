import { ApplicationModel } from "../../../modules/applications/models/application.model";
import { UserRepository } from "../../../modules/user/repository/user.repository";
import { jobRepository } from "../repository/job.repository";

export const CandidategetJobsService = async (
  candidateId: string,
  query: JobQuery
) => {
  const { page, limit, location, jobType, status, search,
    remote,experienceMin,experienceMax,field } = query;

  const candidate = await UserRepository
    .findById(candidateId)
    .select("field skills");

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  const appliedJobIds = await ApplicationModel.find({
  candidateId
}).distinct("jobId");

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


  if (remote !== undefined) filter.remote =remote
  if (field) filter.field = { $regex: field, $options: "i" }
  if (jobType && jobType !== "all") filter.jobType = jobType;
  if (status && status !== "all") filter.status = status;
  if (experienceMin || experienceMax) {
  filter.experienceMin = {
    ...(experienceMin && { $gte: experienceMin }),
    ...(experienceMax && { $lte: experienceMax }),
  }
}
console.log(filter)
  const jobs = await jobRepository.findByQuery(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit).lean();

  const total = await jobRepository.countByQuery(filter);
const appliedJobIdStrings = appliedJobIds.map(id => id.toString());

const jobsWithAppliedFlag = jobs.map(job => ({
  ...job,
  hasApplied: appliedJobIdStrings.includes(job._id.toString()),
}));
  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    jobsWithAppliedFlag,
  };
};
