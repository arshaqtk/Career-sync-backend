import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../../modules/user/repository/user.repository"
import { RecruiterList, RecruiterListResponse } from "../types/Recruiters.types";
import UserModel from "../../../modules/user/models/user.model";

interface BlockRecruiterByAdminInput{
    recruiterId:string;
    reason?:string;
}
interface UnblockRecruiterByAdminInput{
    recruiterId:string;
}

export const adminRecruiterListService = async (
  query: UserQuery
): Promise<RecruiterListResponse> => {
  const { page, limit, status, search } = query

  const match: any = { role: "recruiter" }

  if (search) {
    match.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
  }

  // ✅ Map status → isActive
  if (status && status !== "all") {
    match.isActive = status === "active"
  }

  const skip = (page - 1) * limit

  const [recruiters, totalResult] = await Promise.all([
    UserModel.aggregate([
      { $match: match }, 
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // Jobs lookup
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "postedBy",
          as: "jobs",
        },
      },

      // Compute jobs count + status
      {
        $addFields: {
          jobsPosted: { $size: "$jobs" },
          status: {
            $cond: {
              if: "$isActive",
              then: "active",
              else: "blocked",
            },
          },
        },
      },

      // Final shape
      {
        $project: {
          name: 1,
          email: 1,
          company: 1,
          jobsPosted: 1,
          status: 1,
        },
      },
    ]),
    UserModel.countDocuments(match),
  ])

  const recruitersData: RecruiterList[] = recruiters.map((r: any) => ({
    id: r._id.toString(),
    name: r.name,
    email: r.email,
    company: r.company || "—",
    jobsPosted: r.jobsPosted,
    status: r.status,
  }))

  return {
    recruiters: recruitersData,
    pagination: {
      page,
      limit,
      total: totalResult,
      totalPages: Math.ceil(totalResult / limit),
    },
  }
}




export const getAdminRecruiterDetailService=async(recruiterId:string)=>{
    if(!recruiterId){
        throw new CustomError("Required identifier not found", 400);
    }
    const candidate=await UserRepository.findById(recruiterId)

    if (!candidate || candidate.role !== "recruiter") {
    throw new CustomError("Recruiter not found", 404)
  }

    return candidate

}  


export const blockRecruiterByAdminService = async ({
  recruiterId,
  reason,
}: BlockRecruiterByAdminInput) => {
  if (!recruiterId) {
    throw new CustomError("Required identifiers not found", 400)
  }

  const user = await UserRepository.findById(recruiterId)

  if (!user) {
    throw new CustomError("User not found", 404)
  }

  if (!user.isActive) {
    throw new CustomError("User already blocked", 400)
  }

  await UserRepository.updateById(recruiterId, {
    isActive: false,
    blockedAt: new Date(),
    blockReason: reason ?? "Blocked by admin",
  })

  return { success: true }
}

export const unblockRecruiterByAdminService = async ({
  recruiterId,
}: UnblockRecruiterByAdminInput) => {
  if (!recruiterId) {
    throw new CustomError("Required identifiers not found", 400)
  }

  const user = await UserRepository.findById(recruiterId)

  if (!user) {
    throw new CustomError("User not found", 404)
  }

  if (user.isActive) {
    throw new CustomError("User is already active", 400)
  }

  await UserRepository.updateById(recruiterId, {
    isActive: true,
    blockedAt: null,
    blockReason: null,
  })

  return { success: true }
}