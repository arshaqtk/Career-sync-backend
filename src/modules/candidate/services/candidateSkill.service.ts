import { UserRepository } from "../../../modules/user/repository/user.repository";

export const candidateSkillService=(userId:string,skill:string[])=>{
    return UserRepository.updateById(userId,{"candidateData.skills":skill})
    
}

  