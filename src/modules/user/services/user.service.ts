import { CustomError } from "../../../utils/customError";
import { UpdateUserProfileDTO } from "../dtos/user.dto";
import { UserRepository } from "../repository/user.repository"


export const UserService = {
  getProfile: async (id: string) => {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

   if (user.role === "recruiter") {
  return {
    ...user.toObject(),
    candidateData: undefined
  };
}

return {
  ...user.toObject(),
  recruiterData: undefined
};
  },
  updateUserProfile:async(id:string,dto:UpdateUserProfileDTO)=>{
    const updatedUser=await UserRepository.updateById(id,dto)
    return updatedUser
  },

  updateUserAvatar:async(id:string,profilePictureUrl:string)=>{
    const updatedUser=await UserRepository.updateById(id,profilePictureUrl)
    return updatedUser
  }

};

