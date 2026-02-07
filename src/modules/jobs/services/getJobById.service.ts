import { ApplicationModel } from "../../../modules/applications/models/application.model";
import { jobRepository } from "../repository/job.repository"

export const getJobByIdService=async({jobId,candidateId}:{jobId:string,candidateId?:string})=>{
  let isApplied=false
  if(candidateId){
    const hasApplied = await ApplicationModel.exists({
  candidateId,
  jobId,
});
 isApplied = Boolean(hasApplied);
  }

    const job= await jobRepository.findById(jobId)
    return {...job,hasApplied:isApplied}
}