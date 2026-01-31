import { CustomError } from "../../../shared/utils/customError";
import { UserRepository } from "../../user/repository/user.repository";
import { getResumeDownloadUrl } from "../../../shared/utils/getResumeDownloadUrl";
import { uploadResume } from "./resumeUploadS3.service";
import { deleteFromS3 } from "../../../shared/utils/deleteFromS3";

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
  file: Express.Multer.File
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
  });

  if (oldKey) {
    await deleteFromS3(oldKey);
  }
  return updateResume
};


