// import { calculateExperience } from "../../../shared/utils/date.util";
import { UserRepository } from "../../../modules/user/repository/user.repository";
import { IExperience } from "../../../modules/user/types/user.schema";

export const candidateExperienceService=(userId:string,experience:IExperience)=>{
    
//      const start = new Date(experience.startDate);
//   const end = experience.endDate ? new Date(experience.endDate) : new Date();
//    const exp = calculateExperience(start, end);

//    experience.experienceYears = exp;
    return UserRepository.updateNestedArray(userId,"candidateData.experience",experience)
}

 