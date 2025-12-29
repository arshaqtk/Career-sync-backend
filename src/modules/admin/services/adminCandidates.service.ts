import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../../modules/user/repository/user.repository"
import UserModel from "../../../modules/user/models/user.model";
interface BlockCandidateByAdminInput{
    candidateId:string;
    reason:string;
}
interface UnblockCandidateByAdminInput{
    candidateId:string;
}

export const adminCandidateListService = async (query: UserQuery) => {
  const { page, limit, status, search } = query

  const match: any = { role: "candidate" }
 
  if (search) {
    match.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
  }

  if (status && status !== "all") {
    match.isActive = status==="active"
  }

  const skip = (page - 1) * limit

  const [candidates, total] = await Promise.all([
    UserModel.aggregate([
      { $match: match },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // 🔹 Lookup applications
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "candidateId",
          as: "applications",
        },
      },

      // 🔹 Add derived fields
      {
        $addFields: {
          applicationCount: { $size: "$applications" },

          
          status: {
            $cond: {
              if: "$isActive",
              then: "active",
              else: "blocked",
            },
          },
        },
      },

      // 🔹 Remove heavy fields
      {
        $project: {
          password: 0,
          applications: 0,
        },
      },
    ]),

    UserRepository.countByQuery(match),
  ])

  return {
    candidates,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}


export const getAdminCandidateDetailService=async(candidateId:string)=>{
    if(!candidateId){
        throw new CustomError("Required identifier not found", 400);
    }
    const candidate=await UserRepository.findById(candidateId)

    if (!candidate || candidate.role !== "candidate") {
    throw new CustomError("Candidate not found", 404)
  }

    return candidate

}  


export const blockCandidateByAdminService = async ({
  candidateId,
  reason,
}: BlockCandidateByAdminInput) => {
  if (!candidateId) {
    throw new CustomError("Required identifiers not found", 400)
  }

  const user = await UserRepository.findById(candidateId)

  if (!user) {
    throw new CustomError("User not found", 404)
  }

  if (!user.isActive) {
    throw new CustomError("User already blocked", 400)
  }

  await UserRepository.updateById(candidateId, {
    isActive: false,
    blockedAt: new Date(),
    blockReason: reason ?? "Blocked by admin",
  })

  return { success: true }
}

export const unblockCandidateByAdminService = async ({
  candidateId,
}: UnblockCandidateByAdminInput) => {
  if (!candidateId) {
    throw new CustomError("Required identifiers not found", 400)
  }

  const user = await UserRepository.findById(candidateId)

  if (!user) {
    throw new CustomError("User not found", 404)
  }

  if (user.isActive) {
    throw new CustomError("User is already active", 400)
  }

  await UserRepository.updateById(candidateId, {
    isActive: true,
    blockedAt: null,
    blockReason: null,
  })

  return { success: true }
}