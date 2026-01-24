import { UserRepository } from "../../user/repository/user.repository"
import { CustomError } from "../../../shared/utils/customError"
import { jobRepository } from "../../../modules/jobs/repository/job.repository"
import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { InterviewRepository } from "../../../modules/Interview/repository/interview.repository"
import { Types } from "mongoose"
import { buildJobStatsPipeline } from "../../../modules/jobs/repository/buildJobStatusPipeline"
import { endOfDay, startOfDay } from "date-fns"
import { ApplicationModel } from "../../../modules/applications/models/application.model"
import { InterviewModel } from "../../../modules/Interview/models/interview.model"

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

   const getRecruiterDashboardDataService=async(recruiterId:string)=>{
      if(!recruiterId){
         throw new CustomError("unAuthorized User Not Found",401)
      }

        const startOfToday = startOfDay(new Date())
  const endOfToday = endOfDay(new Date())


      //stats cards
      const activeJobs=await jobRepository.countByQuery({postedBy:recruiterId,
         status:"open"
      })
      const newApplications=await applicationRepository.countByQuery({
         recruiterId,createdAt:{
            $gte:startOfToday,
            $lte:endOfToday
         },
      })
      const interviewsToday=await interviewRepository.countByQuery({
         recruiterId,startTime:{
            $gte:startOfToday,
            $lte:endOfToday
         }
      })
      const hiredCandidates=await applicationRepository.countByQuery({
         recruiterId,
         status:"Selected"
      })

      //action center Counts

      const pendingReview=await applicationRepository.countByQuery({
         recruiterId,status:"Pending"
      })

      const interviewsToSchedule=await interviewRepository.countByQuery({
         recruiterId,
         status:"Shortlisted"
      })

//       const feedbackPending = await InterviewModel.countDocuments({
//   recruiterId,
//   status: "Completed",
//   feedbackSubmitted: false,
// })

//================ Recent Applications=========================

const recentApplications=await ApplicationModel.aggregate([
   {$match:{recruiterId:new Types.ObjectId(recruiterId)}},
   {$sort:{createdAt:-1}},
   {$limit:5},
   {
      $lookup:{
         from:"jobs",
         localField:"jobId",
         foreignField:"_id",
         as:"job"
      }
   },{
      $unwind:"$job"
   },{
      $lookup:{
         from:"users",
         localField:"candidateId",
         foreignField:"_id",
         as:"users"
      }
   },{
      $unwind:"$users"
   },{
      $project:{
         id:"$_id",
         candidateName:"$users.name",
         jobTitle:"$job.title",
         experience:1,
         status:1
      }
   }
])

// ==================Todays Interviews=========================

const todaysInterviews=await InterviewModel.aggregate([
   {
      $match:{recruiterId:new Types.ObjectId(recruiterId),startTime:{
          $gte:startOfToday,
            $lte:endOfToday
      }}
   },
   {
      $sort:{startTime:1}
   },{$limit:5},
   {
      $lookup:{
         from:"applications",
         localField:"applicationId",
         foreignField:"_id",
         as:"application"
      }
   },
     { $unwind: "$application" },
  {
    $project: {
      id: "$_id",
      candidateName: "$application.candidateName",
      role: "$application.jobTitle",
      time: {
        $dateToString: {
          format: "%H:%M",
          date: "$startTime",
        },
      },
      round: 1,
    },
  },
])


const funnelAgg = await ApplicationModel.aggregate([
  { $match: { recruiterId:new Types.ObjectId(recruiterId) } },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
    },
  },
])

const funnel = {
  applied: 0,
  shortlisted: 0,
  interviewed: 0,
  selected: 0,
  hired: 0,
}



funnelAgg.forEach((item) => {
  if (item._id === "Pending") funnel.applied = item.count
  if (item._id === "Shortlisted") funnel.shortlisted = item.count
  if (item._id === "Interview") funnel.interviewed = item.count
  if (item._id === "Selected") funnel.selected = item.count
//   if (item._id === "Hired") funnel.hired = item.count
})


      return {
  stats: {
    activeJobs,
    newApplications,
    interviewsToday,
    hiredCandidates,
  },
  actions: [
    { label: "Applications Pending Review", count: pendingReview, action: "review" },
    { label: "Interviews to Schedule", count: interviewsToSchedule, action: "schedule" },
   //  { label: "Feedback Pending", count: feedbackPending, action: "feedback" },
  ],
  recentApplications,
  todaysInterviews,
  funnel,
}
   }






   return {
      getProfileStats,
      getCandidateProfile,
      getRecruiterDashboardDataService
   }


}