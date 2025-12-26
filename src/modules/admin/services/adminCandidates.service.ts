import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../../modules/user/repository/user.repository"
interface BlockCandidateByAdminInput{
    candidateId:string;
    reason:string;
}
interface UnblockCandidateByAdminInput{
    candidateId:string;
}

export const adminCandidateListService=async(query:UserQuery)=>{
     const { page, limit,status,search } = query;
     const filter:any={role:"candidate"}
     
     if(search){
          filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
     }
     if(status&&status!=="all"){
        filter.status=status
     }
   const candidates= await UserRepository.findByQuery(filter)
   .sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean()
   const total=await UserRepository.countByQuery(filter)

   return {candidates,
     pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }}
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