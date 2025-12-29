import { CustomError } from "../../../shared/utils/customError"
import { JobModel } from "../../../modules/jobs/models/job.model"
import { Types } from "mongoose"




export const adminJobListService = async (query: {
  page: number
  limit: number
  status?: "active" | "blocked" | "closed" | "all"
  search?: string
}) => {
  const { page, limit, status, search } = query

  const match: any = {}

 
  if (search) {
    match.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ]
  }

  if (status && status !== "all") {
    if (status === "active") match.status = "open"
    if (status === "closed") match.status = "closed"
    if (status === "blocked") match.status = "paused"
  }

  const skip = (page - 1) * limit

  const [jobs, total] = await Promise.all([
    JobModel.aggregate([
      { $match: match },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },

      
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "open"] }, then: "active" },
                { case: { $eq: ["$status", "closed"] }, then: "closed" },
                { case: { $eq: ["$status", "paused"] }, then: "blocked" },
              ],
              default: "active",
            },
          },
        },
      },

     
      {
        $project: {
          title: 1,
          company: 1,
          jobType: 1,
          location: 1,
          field: 1,
          remote: 1,
          status: 1,
          createdAt: 1,

         
          applicationCount: 1,

          recruiter: {
            _id: "$recruiter._id",
            name: "$recruiter.name",
            email: "$recruiter.email",
          },
        },
      },
    ]),

    JobModel.countDocuments(match),
  ])

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}


export const getAdminJobDetailService = async (jobId: string) => {
  if (!jobId || !Types.ObjectId.isValid(jobId)) {
    throw new CustomError("Invalid job identifier", 400)
  }

  const job = await JobModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(jobId) },
    },

   
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },

   
    {
      $addFields: {
        status: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "open"] }, then: "active" },
              { case: { $eq: ["$status", "closed"] }, then: "closed" },
              { case: { $eq: ["$status", "paused"] }, then: "blocked" },
            ],
            default: "active",
          },
        },
      },
    },

   
    {
      $project: {
        title: 1,
        company: 1,
        description: 1,
        skills: 1,
        experienceMin: 1,
        experienceMax: 1,
        salary: 1,
        field: 1,
        jobType: 1,
        location: 1,
        remote: 1,
        createdAt: 1,
        applicationCount: 1,
        status: 1,

       recruiter: {
  _id: "$recruiter._id",
  name: "$recruiter.name",
  email: "$recruiter.email",
  company: "$recruiter.company",

  status: {
    $cond: {
      if: "$recruiter.isActive",
      then: "active",
      else: "blocked",
    },
  },
}
      },
    },
  ])

  if (!job.length) {
    throw new CustomError("Job not found", 404)
  }

  return job[0]
}



export const blockJobByAdminService = async ({
  jobId,
  reason,
}: {
  jobId: string
  reason: string
}) => {
  if (!jobId) {
    throw new CustomError("Required identifiers not found", 400)
  }

  if (!reason?.trim()) {
    throw new CustomError("Block reason is required", 400)
  }

  const job = await JobModel.findById(jobId)

  if (!job) {
    throw new CustomError("Job not found", 404)
  }

 
  if (job.status === "paused") {
    throw new CustomError("Job already blocked", 400)
  }

  await JobModel.updateOne(
    { _id: jobId },
    {
      status: "paused",
      blockedAt: new Date(),
      blockedReason: reason,
    }
  )

  return { success: true }
}

export const unblockJobByAdminService = async ({
  jobId,
}: {
  jobId: string
}) => {
  if (!jobId) {
    throw new CustomError("Required identifiers not found", 400)
  }

  const job = await JobModel.findById(jobId)

  if (!job) {
    throw new CustomError("Job not found", 404)
  }


  if (job.status !== "paused") {
    throw new CustomError("Job is not blocked", 400)
  }

 
  // If recruiter already closed it earlier, do NOT reopen
  const newStatus = job.wasClosedByRecruiter ? "closed" : "open"

  await JobModel.updateOne(
    { _id: jobId },
    {
      status: newStatus,
      blockedAt: null,
      blockedReason: null,
    }
  )

  return { success: true }
}
