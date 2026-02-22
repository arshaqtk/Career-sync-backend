import { ApplicationModel } from "../../../modules/applications/models/application.model";
import { JobModel } from "../models/job.model";

export const getJobByIdService = async ({
  jobId,
  candidateId
}: {
  jobId: string;
  candidateId?: string;
}) => {

  const hasApplied = candidateId
    ? await ApplicationModel.exists({ candidateId, jobId })
    : false;

  const job = await JobModel.findById(jobId)
    .populate({
      path: "company",
      select: "name logo description location industry size foundedYear"
    })
    .lean();

  if (!job) return null;

  return {
    ...job,
    hasApplied: Boolean(hasApplied)
  };
};