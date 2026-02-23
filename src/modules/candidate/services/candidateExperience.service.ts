import { UserRepository } from "../../../modules/user/repository/user.repository";
import { IExperience } from "../../../modules/user/types/user.schema";
import { IUser } from "../../user/models/user.model";

export const addCandidateExperienceService=(userId:string,experience:IExperience)=>{
    return UserRepository.updateNestedArray(userId,"candidateData.experience",experience)
}

export const updateCandidateProfileExperienceService=({userId,experienceId,experience}:{userId:string,experienceId:string,experience:IExperience})=>{
console.log(experience)
    const updated:Record<`candidateData.experience.$.${string}`, any>={}
    for(let key in experience){
         const typedKey = key as keyof IExperience;
        updated[`candidateData.experience.$.${key}`]=experience[typedKey]
    }
    return  UserRepository.updateExperience(userId,experienceId,updated)
}