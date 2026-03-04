import redis from "@/config/redis";
import { ApplicationModel } from "../../../modules/applications/models/application.model";
import { UserRepository } from "../../../modules/user/repository/user.repository";
import { JobModel } from "../models/job.model";

export const CandidategetJobsService = async ({
  candidateId,
  query
}: {
  candidateId?: string;
  query: JobQuery;
}) => {

  const {
    page = 1,
    limit = 10,
    location,
    jobType,
    status,
    search,
    remote,
    experienceMin,
    experienceMax,
    field,
    recommended
  } = query;

  let candidate;

  // Fetch candidate data only if recommended jobs requested
  if (candidateId && recommended) {
    candidate = await UserRepository
      .findById(candidateId)
      .select("field candidateData.skills")
      .lean();
  }

  // Jobs applied by user
  const appliedJobIds = candidateId
    ? await ApplicationModel.find({ candidateId }).distinct("jobId")
    : [];

  const appliedSet = new Set(appliedJobIds.map(id => id.toString()));

  const filter: any = {};

  // Default job status
  if (status && status !== "all") {
    filter.status = status;
  } else {
    filter.status = "open";
  }

  // Recommended logic
  if (recommended) {

    if (candidate?.field) {
      filter.field = candidate.field;
    }

    if (candidate?.candidateData?.skills?.length) {
      filter.skillsRequired = {
        $in: candidate.candidateData.skills
      };
    }
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (remote !== undefined) filter.remote = remote;

  if (field) {
    filter.field = { $regex: field, $options: "i" };
  }

  if (jobType && jobType !== "all") {
    filter.jobType = jobType;
  }

  if (experienceMin || experienceMax) {
    filter.experienceMin = {
      ...(experienceMin && { $gte: experienceMin }),
      ...(experienceMax && { $lte: experienceMax }),
    };
  }

  // Create unique cache key based on query
  const queryKey = Buffer.from(JSON.stringify({
    page,
    limit,
    location,
    jobType,
    status,
    search,
    remote,
    experienceMin,
    experienceMax,
    field,
    recommended
  })).toString("base64");

  const jobsCacheKey = `jobs:list:${queryKey}`;
  const countCacheKey = `jobs:count:${queryKey}`;

  let jobs;
  let total;

  // -------- JOB LIST CACHE --------
  const cachedJobs = await redis.get(jobsCacheKey);

  if (cachedJobs) {
    jobs = JSON.parse(cachedJobs);
  } else {

    jobs = await JobModel.find(filter)
      .populate({
        path: "company",
        select: "name"
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    await redis.set(
      jobsCacheKey,
      JSON.stringify(jobs),
      { EX: 60 }
    );
  }

  // -------- COUNT CACHE --------
  const cachedCount = await redis.get(countCacheKey);

  if (cachedCount) {
    total = Number(cachedCount);
  } else {

    total = await JobModel.countDocuments(filter);

    await redis.set(
      countCacheKey,
      total.toString(),
      { EX: 300 }
    );
  }

  // -------- USER SPECIFIC LOGIC --------
  const jobsWithAppliedFlag = jobs.map((job: any) => ({
    ...job,
    hasApplied: appliedSet.has(job._id.toString())
  }));

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    jobs: jobsWithAppliedFlag
  };
};