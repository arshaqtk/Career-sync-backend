import { UserRepository } from "../../../modules/user/repository/user.repository";
import { IEducation } from "../../../modules/user/types/user.schema";

export const addCandidateEducationeService=(userId:string,education:IEducation)=>{
    return UserRepository.updateNestedArray(userId,"candidateData.education",education)
}

export const updateCandidateEducationService=({userId,educationId,education}:{userId:string,educationId:string,education:IEducation})=>{

    const updated:Record<`candidateData.education.$.${string}`, any>={}
    for(let key in education){
         const typedKey = key as keyof IEducation;
        updated[`candidateData.education.$.${key}`]=education[typedKey]
    }
    return  UserRepository.updateEducation(userId,educationId,updated)
}