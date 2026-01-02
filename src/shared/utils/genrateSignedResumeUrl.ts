import { v2 as cloudinary } from "cloudinary";

export const getSignedResumeUrl = (publicId: string) => {
  return cloudinary.utils.private_download_url(
    publicId,"",
    {
      resource_type: "raw",
      expires_at: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes
    }
  );
};