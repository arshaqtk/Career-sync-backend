import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../../modules/user/repository/user.repository"

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