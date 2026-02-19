import { ApplicationModel } from "../../../modules/applications/models/application.model";
import { JobModel } from "../models/job.model";

export const getJobByIdService = async ({ jobId, candidateId }: { jobId: string, candidateId?: string }) => {
  const hasApplied = await ApplicationModel.exists({
    candidateId,
    jobId,
  });

  const isApplied = Boolean(hasApplied);
  const job: any = await JobModel.findById(jobId)
    .populate({
      path: 'postedBy',
      select: 'recruiterData.company',
      populate: {
        path: 'recruiterData.company',
        select: 'name logo description location industry size foundedYear'
      }
    }).lean();

  if (!job) return null;

  return {
    ...job,
    companyId: job.postedBy?.recruiterData?.company?._id || null,
    companyLogo: job.postedBy?.recruiterData?.company?.logo?.url || null,
    companyDescription: job.postedBy?.recruiterData?.company?.description || null,
    hasApplied: isApplied
  }
}