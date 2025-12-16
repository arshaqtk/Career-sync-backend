import { UserRepository } from "../../user/repository/user.repository"
import { CustomError } from "../../../shared/utils/customError"



export const RecruiterService=()=>{


    const getCandidateProfile=async(candidateId:string)=>{
         if (!candidateId) throw new CustomError("User Not Found", 404)
            const candidate=UserRepository.findById(candidateId)
        return candidate
         }

         return {
            getCandidateProfile
         }
}