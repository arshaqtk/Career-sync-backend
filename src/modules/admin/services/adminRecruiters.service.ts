import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../../modules/user/repository/user.repository"

interface BlockRecruiterByAdminInput{
    recruiterId:string;
    reason?:string;
}
interface UnblockRecruiterByAdminInput{
    recruiterId:string;
}
export const adminRecruiterListService=async(query:UserQuery)=>{
     const { page, limit,status,search } = query;
     const filter:any={role:"recruiter"}
     
     if(search){
          filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
     }
     if(status&&status!=="all"){
        filter.status=status
     }
   const recruiters= await UserRepository.findByQuery(filter)
   .sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean()
   const total=await UserRepository.countByQuery(filter)

   return {recruiters,
     pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }}
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