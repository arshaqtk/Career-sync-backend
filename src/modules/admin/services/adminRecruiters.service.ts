import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../../modules/user/repository/user.repository"

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