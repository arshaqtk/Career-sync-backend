import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { jobRepository } from "../../../modules/jobs/repository/job.repository"
import { UserRepository } from "../../../modules/user/repository/user.repository"
const applicationRepository=ApplicationRepository()


export const adminDashboardStatsService=async()=>{
     const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
    const recruitersCount=await UserRepository.countByQuery({role:"recruiter"})
    const candidateCount=await UserRepository.countByQuery({role:"candidate"})
    const activeJobsCount=await jobRepository.countByQuery({status:"open"})
    const applicationsTodayCount=await applicationRepository.countByQuery({ createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },}) 

    return {
        recruitersCount,candidateCount, 
        activeJobsCount,applicationsTodayCount
    }
}