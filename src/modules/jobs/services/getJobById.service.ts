import { jobRepository } from "../repository/job.repository"

export const getJobByIdService=async(jobId:string)=>{
    return await jobRepository.findById(jobId)
}