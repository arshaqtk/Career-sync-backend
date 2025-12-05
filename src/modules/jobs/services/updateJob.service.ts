import { IJob } from "../types/JobModel.type";
import { jobRepository } from "../repository/job.repository";
import { CustomError } from "../../../shared/utils/customError";

interface UpdateJob{
    data:Partial<IJob>;
    employerId:string;
    jobId:string;
}

export const updateJobService = async ({data,employerId,jobId}:UpdateJob) => {
  const job=await jobRepository.findOneByQuery({ _id: jobId, postedBy: employerId,})
  if(!job||job==null){
    throw new CustomError("Job not found or you are not allowed to update this job",403)
  }
  if (Object.keys(data).length === 0) {
  throw new CustomError("No update data provided", 400);
}
  return jobRepository.updateById(jobId,data);
}; 