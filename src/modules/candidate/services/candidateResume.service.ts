import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../user/repository/user.repository";
import { getResumeDownloadUrl } from "../../../shared/utils/getResumeDownloadUrl";
import { uploadResume } from "./resumeUploadS3.service";
import { deleteFromS3 } from "../../../shared/utils/deleteFromS3";
import UserModel from "@/modules/user/models/user.model";
import { candidateSkillService } from "./candidateSkill.service";
import { addCandidateExperienceService } from "./candidateExperience.service";
import { addCandidateEducationeService } from "./candidateEducation.service";
import { UserService } from "@/modules/user/services/user.service";
import { ParsedResume } from "../types/resume.types";



export const getUserByIdService = async (userId: string) => {
  return UserModel
    .findById(userId)
    .select("candidateData.isProfileInitialized");
};




export const getResumeService = async ({ userId, mode }: { userId: string, mode: "download" | "view" }) => {
  const user = await UserRepository.findById(userId)
  const resumeKey = user?.candidateData?.resume?.key
  if (!resumeKey) {
    throw new CustomError("Resume is not exist")
  }
  const url = await getResumeDownloadUrl(resumeKey, mode);

  return url
}

export const deleteResumeService=async({userId}:{userId:string})=>{
   const user = await UserRepository.findById(userId)
  const oldKey = user?.candidateData?.resume?.key
  await UserRepository.removeFieldById(userId,{"candidateData.resume": 1})
  
   if (oldKey) {
    await deleteFromS3(oldKey);
  }
   
}



export const updateResumeService = async (
  userId: string,
  file: Express.Multer.File,
  parsed: ParsedResume
) => {

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error("Uploaded file is empty");
  }
  const { key } = await uploadResume(file, userId);
  const user = await UserRepository.findById(userId)
  const oldKey = user?.candidateData?.resume?.key

  const updateResume = await UserRepository.updateById(userId, {
    "candidateData.resume.key": key,
    "candidateData.resume.originalName": file.originalname,
    "candidateData.resume.uploadedAt": new Date(),
    "candidateData.resumeData": parsed,
  });

  if (oldKey) {
    await deleteFromS3(oldKey);
  }
  return updateResume
};


export const initializeProfileFromResumeService = async (
  userId: string,
  file: Express.Multer.File,
  parsed: ParsedResume
) => {
  const { key } = await uploadResume(file,userId);

  // Promise.allSettled — partial success better than total failure
  const [resume, skills, experience, education, profile] = 
    await Promise.allSettled([

      // resume file
      UserModel.findByIdAndUpdate(userId, {
        $set: {
          "candidateData.resume.key":  key,
          "candidateData.resumeData":  parsed,
          "candidateData.isProfileInitialized": true,
        }
      }),

      // skills
      parsed?.skills?.length 
        ? candidateSkillService(userId, parsed.skills) 
        : Promise.resolve(null),

      // experience
      parsed?.experience?.length 
        ? Promise.all(parsed.experience.map(exp => addCandidateExperienceService(userId, exp as any))) 
        : Promise.resolve(null),

      // education
      parsed?.education?.length 
        ? Promise.all(parsed.education.map(edu => addCandidateEducationeService(userId, edu as any))) 
        : Promise.resolve(null),

      // basic profile
      UserService.updateUserNestedField(userId, "candidateData.about", parsed.summary)
    ]);

  return {
    resume:     resume.status     === "fulfilled" ? resume.value     : null,
    skills:     skills.status     === "fulfilled" ? skills.value     : null,
    experience: experience.status === "fulfilled" ? experience.value : null,
    education:  education.status  === "fulfilled" ? education.value  : null,
    profile:    profile.status    === "fulfilled" ? profile.value    : null,
  };
};