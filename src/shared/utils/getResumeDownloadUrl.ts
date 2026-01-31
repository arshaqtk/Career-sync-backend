import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../../config/s3";

export const getResumeDownloadUrl = async (key: string,mode:"download"|"view") => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
     ResponseContentDisposition:
      mode === "download"
        ? 'attachment; filename="resume.pdf"'
        : "inline",
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60*60, // 1 minute
  });

  return signedUrl;
};
