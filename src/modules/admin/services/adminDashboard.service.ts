import { endOfDay, startOfDay, subDays } from "date-fns"
import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { jobRepository } from "../../../modules/jobs/repository/job.repository"
import { UserRepository } from "../../../modules/user/repository/user.repository"
import UserModel from "../../../modules/user/models/user.model"
import { JobModel } from "../../../modules/jobs/models/job.model"
const applicationRepository = ApplicationRepository()


export const adminDashboardStatsService = async () => {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
  const recruitersCount = await UserRepository.countByQuery({ role: "recruiter" })
  const candidateCount = await UserRepository.countByQuery({ role: "candidate" })
  const activeJobsCount = await jobRepository.countByQuery({ status: "open" })
  const applicationsTodayCount = await applicationRepository.countByQuery({
    createdAt: {
      $gte: startOfToday,
      $lte: endOfToday,
    },
  })

  return {
    recruitersCount, candidateCount,
    activeJobsCount, applicationsTodayCount
  }
}

export const adminDashboardService = async () => {
  const endDate = endOfDay(new Date())
  const startDate = startOfDay(subDays(new Date(), 30))

  //============Stats=======================

  const totalUsers = await UserRepository.countByQuery({})
  const recruiters = await UserRepository.countByQuery({ role: "recruiter" })
  const candidates = await UserRepository.countByQuery({ role: "candidate" })
  const jobs = await jobRepository.countByQuery({})
  const applicationsLast30Days = await applicationRepository.countByQuery({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })

  //===========RecruiterOverview===================

  const recruiterOverview = await UserModel.aggregate([
    {
      $match: {
        role: "recruiter"
      }
    },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "postedBy",
        as: "jobs"
      },
    },
    {
      $project: {
        name: "$name",
        company: "$recruiterData.companyName",
        status: {
          $cond: {
            if: { $eq: ["$isActive", true] },
            then: "Active",
            else: "Inactive",
          },
        },
        lastActive: "$lastLoginAt",
        jobPosted: { $size: "$jobs" },
      },
    },
    {
      $sort: { lastActive: -1 },
    },
    {
      $limit: 5,
    },

  ])

  const jobModeration = await JobModel.aggregate([

    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },

    //  Join reports
    {
      $lookup: {
        from: "reports",
        let: { jobId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$entityId", "$$jobId"] },
                  { $eq: ["$entityType", "job"] },
                ],
              },
            },
          },
        ],
        as: "reports",
      },
    },

    //  Count reports
    {
      $addFields: {
        reportsCount: { $size: "$reports" },
      },
    },

    //  ONLY jobs that need moderation
    {
      $match: {
        reportsCount: { $gt: 0 },
      },
    },

    //  Shape response for UI
    {
      $project: {
        id: "$_id",
        title: 1,
        recruiter: "$recruiter.recruiterData.companyName",
        reports: "$reportsCount",
        status: 1,
        postedAt: "$createdAt",
      },
    },

    //  Most reported first
    {
      $sort: { reports: -1 },
    },

    // Dashboard preview
    {
      $limit: 5,
    },
  ])

  //=================System health====================
  const flaggedJobs = await jobRepository.countByQuery({
  status: "Flagged",
})
const blockedRecruiters = await UserRepository.countByQuery({
  role: "recruiter",
  isActive:false,
})

let status: "Stable" | "Warning" | "Critical" = "Stable"

if (flaggedJobs > 10 || blockedRecruiters > 5) {
  status = "Warning"
}

if (flaggedJobs > 25 || blockedRecruiters > 10) {
  status = "Critical"
}

  return {
    stats: {
      totalUsers,
      recruiters,
      candidates,
      jobs,
      applicationsLast30Days
    },
    recruiterOverview,
    jobModeration,
    systemHealth:{
      status,
      flaggedJobs,
      blockedRecruiters
    }
  }

}