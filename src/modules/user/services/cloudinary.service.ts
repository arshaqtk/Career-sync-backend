import cloudinary from "../../../config/cloudinary";

export const CloudinaryService={
    uploadProfilePic:async(file:Express.Multer.File)=>{
        return new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream(
                {
                    folder:"profile_pictures",
                    resource_type:"image"
                },
                (err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result?.secure_url);
                    }
                }
            ).end(file.buffer)
        })
    }
}