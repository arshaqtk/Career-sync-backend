import { UserRepository } from "../../user/repository/user.repository"
import { CustomError } from "../../../shared/utils/customError"
import { jobRepository } from "../../../modules/jobs/repository/job.repository"
import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { InterviewRepository } from "../../../modules/Interview/repository/interview.repository"
import { Types } from "mongoose"
import { buildJobStatsPipeline } from "../../../modules/jobs/repository/buildJobStatusPipeline"

const applicationRepository = ApplicationRepository()
const interviewRepository = InterviewRepository()

export const RecruiterService = () => {


   const getCandidateProfile = async (candidateId: string) => {
      if (!candidateId) throw new CustomError("User Not Found", 404)
      const candidate = UserRepository.findById(candidateId)
      return candidate
   }

   const getProfileStats = async (recruiterId: string) => {
      if (!recruiterId) throw new CustomError("User Not Found", 404)
      const pipeline = buildJobStatsPipeline({
         postedBy: new Types.ObjectId(recruiterId),
      });

      const jobsCount = await jobRepository.findJobStats(pipeline)
      const applicationsCount = await applicationRepository.countByQuery({ recruiterId });
      const interviewsCount = await interviewRepository.countByQuery({ recruiterId });
      const hiresCount = await applicationRepository.countByQuery({
         recruiterId,
         status: "Selected",
      });

     const [{ jobsPosted = [], activeJobs = [] } = {}] = jobsCount;

return {
  jobsPosted: jobsPosted[0]?.count ?? 0,
  activeJobs: activeJobs[0]?.count ?? 0,
  applicationsCount,
  interviewsCount,
  hiresCount,
};
   }
   return {
      getProfileStats,
      getCandidateProfile
   }


}