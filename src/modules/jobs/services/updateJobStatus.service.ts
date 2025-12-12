import { jobRepository } from "../repository/job.repository";
import { CustomError } from "../../../shared/utils/customError";
import { UpdateJobStatusDTO } from "../types/jobStatus.types";

interface UpdateJobStatus{
    data:UpdateJobStatusDTO;
    employerId:string;
    jobId:string;
}

export const updateJobStatusService = async ({data,employerId,jobId}:UpdateJobStatus) => {
  const job=await jobRepository.findOneByQuery({ _id: jobId, postedBy: employerId,})
  if(!job||job==null){
    throw new CustomError("Job not found or you are not allowed to update this job",403)
  }
  if (Object.keys(data).length === 0) {
  throw new CustomError("No update data provided", 400);
}
  return jobRepository.updateById(jobId,{ $set: data });
}; 