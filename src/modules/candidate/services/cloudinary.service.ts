import { v2 as cloudinary } from "cloudinary";

export const uploadResume = (
  file: Express.Multer.File,
  options: Record<string, any>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // IMPORTANT
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    );

    // Best & correct way for PDFs/DOCs
    uploadStream.write(file.buffer);
    uploadStream.end();
  });
};
