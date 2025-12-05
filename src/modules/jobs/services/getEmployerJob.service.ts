import { jobRepository } from "../repository/job.repository"

export const getEmployerJobService=async(employerId:string)=>{
    
    const jobs= await jobRepository.findByQuery({postedBy:employerId})
    const total = await jobRepository.countByQuery({postedBy:employerId});

    return {total,jobs}
}