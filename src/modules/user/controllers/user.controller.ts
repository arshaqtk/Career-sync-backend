import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../../shared/utils/customError";
import { CloudinaryService } from "../services/cloudinary.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role?: "candidate"|"recruiter" ;email:string };
    }
  }
}
export const UserController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      throw new CustomError("Unauthorized", 401);
    }
    const result = await UserService.getProfile(id);

    res.status(200).json(result);
  }),


  updateUserProfileBasic: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    if (!id) {
      throw new CustomError("Unauthorized", 401);
    }
    const dto = req.body;

    const result = await UserService.updateUserProfile(id, dto)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }),

  updateuserAvatar: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?.id
    console.log(req.file)
    if (!id) {
      throw new CustomError("Unauthorized", 401);
    }
    if (!req.file) {
      throw new CustomError("Image can't find", 401);
    }
    const imageUrl = await CloudinaryService.uploadProfilePic(req.file);
    const profilePictureUrl = imageUrl as string;
    const result = await UserService.updateUserAvatar(id, profilePictureUrl)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }),
  
  updateUserProfileAbout: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    if (!id) {
      throw new CustomError("Unauthorized", 401);
    }
    const {about}=req.body
    const result = await UserService.updateUserNestedField(id,"candidateData.about",about)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }),
  

 updateRecruiterCompany :async (req: Request, res: Response) => {
  const userId = req.user?.id
if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }
  const {
    companyName,
    companyWebsite,
    companyLocation,
    companyDescription,
  } = req.body
  const user=await UserService.updateRecruiterCompany({recruiterId:userId,payload:{
    companyName,
    companyWebsite,
    companyLocation,
    companyDescription,
  }})
  res.json({
    message: "Company details updated",
    recruiterData: user.recruiterData,
  })
}

};

