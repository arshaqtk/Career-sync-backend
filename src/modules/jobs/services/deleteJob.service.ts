import { jobRepository } from "../repository/job.repository";
import { CustomError } from "../../../shared/utils/customError";

interface DeleteJob{
    employerId:string;
    jobId:string;
}

export const deleteJobService=async({employerId,jobId}:DeleteJob)=>{
     const job=await jobRepository.findOneByQuery({ _id: jobId, postedBy: employerId,})
       if(!job||job==null){
        throw new CustomError("Job not found or you are not allowed to delete this job",403)
      }
      const deletedJob = await jobRepository.deleteById(jobId);
  return deletedJob;
}