import { uploadResume } from "../services/cloudinary.service";
import { UserRepository } from "../../user/repository/user.repository";

export const updateResumeService = async (
  userId: string,
  file: Express.Multer.File
) => {
  const extension = file.originalname.split(".").pop() || "pdf";

  const uploadedUrl = await uploadResume(file, {
    public_id: `resume/${Date.now()}`,
    folder: "resume",
    format: extension,
  });

  return UserRepository.updateById(userId, {
    "candidateData.resume.url": uploadedUrl,
    "candidateData.resume.originalName": file.originalname,
    "candidateData.resume.uploadedAt": new Date(),
  });
};
