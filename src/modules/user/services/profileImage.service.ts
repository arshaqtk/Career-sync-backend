import s3 from "../../../config/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadProfileImage=async(file:Express.Multer.File,userId:string)=>{
const key=`profile-images/${userId}/${Date.now()}-${file.originalname}`;
await s3.send(
    new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:key,
        Body:file.buffer,
        ContentType:file.mimetype,
    })
)
const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

return {key,url};
}






