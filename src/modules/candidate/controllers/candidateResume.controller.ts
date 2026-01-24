import expressAsyncHandler from "express-async-handler";
import { Request,Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { updateResumeService } from "../services/candidateResume.service";


// export const updateResumeController=expressAsyncHandler(async(req:Request,res:Response)=>{
//         const id = req.auth?.id
     
//         if (!id) {
//           throw new CustomError("unAuthorized User Not Found", 401);
//         }
//         if (!req.file) {
//           throw new CustomError("Resume can't find", 401);
//         }
//         const originalName=req.file.originalname
//         const resumeUrl = await CloudinaryService.uploadResume(req.file, {
//   resource_type: "raw",
//   public_id: `resume/${Date.now()}`,
//   format: file.originalname.split(".").pop(),
// });
//         const  resume_url= resumeUrl as string;
//         const result = await updateResumeService(id,resume_url,originalName)
//         res.status(200).json({
//           success: true,
//           message: "Profile updated successfully",
//           data: result,
//         });
//       })

export const updateResumeController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.auth?.id as string

    if (!id) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }

    if (!req.file) {
      throw new CustomError("Resume file not found", 400);
    }
   

    const result = await updateResumeService(id, req.file);

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: result,
    });
  }
);

