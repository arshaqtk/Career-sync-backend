import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../config/s3";

export const deleteFromS3 = async (key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    })
  );
};