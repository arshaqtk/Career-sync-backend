// services/resume.service.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../../config/s3";

export const uploadResume = async (
  file: Express.Multer.File,
  userId: string
) => {
  const key = `resumes/${userId}/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype|| "application/pdf",
    })
  );
  return {key};
};
