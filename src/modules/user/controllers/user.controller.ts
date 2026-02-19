import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../../shared/utils/customError";
import { uploadProfileImage } from "../services/profileImage.service";
import { catchAsync } from "../../../middlewares/asyncHandler";


export const UserController = {
  getOnlineUsers:catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getOnlineUsers();
    res.status(200).json({
    users,
    count: users.length
  });
  }),
  getProfile: catchAsync(async (req: Request, res: Response) => {
    const id = req.auth?.id;
    if (!id) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }
    const result = await UserService.getProfile(id);

    res.status(200).json(result);
  }),


  updateUserProfileBasic: catchAsync(async (req: Request, res: Response) => {
    const id = req.auth?.id as string;
    if (!id) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }
    const dto = req.body;

    const result = await UserService.updateUserProfile(id, dto)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }),

  updateuserAvatar: catchAsync(async (req: Request, res: Response) => {
    const id = req.auth?.id
    console.log(req.file)
    if (!id) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }
    if (!req.file) {
      throw new CustomError("Image can't find", 401);
    }
   const { key, url } = await uploadProfileImage(req.file, id);
    const result = await UserService.updateUserAvatar(id, {
    key,
    url,
  })
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }),
  
  updateUserProfileAbout: catchAsync(async (req: Request, res: Response) => {
    const id = req.auth?.id as string;
    if (!id) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }
    const {about}=req.body
    const result = await UserService.updateUserNestedField(id,"candidateData.about",about)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }),
  

//  updateRecruiterCompany :async (req: Request, res: Response) => {
//   const userId = req.auth?.id
// if (!userId) {
//       throw new CustomError("unAuthorized User Not Found", 401);
//     }
//   const {
//     companyName,
//     companyWebsite,
//     companyLocation,
//     companyDescription,
//   } = req.body
//   const user=await UserService.updateRecruiterCompany({recruiterId:userId,payload:{
//     companyName,
//     companyWebsite,
//     companyLocation,
//     companyDescription,
//   }})
//   res.json({
//     message: "Company details updated",
//     recruiterData: user,
//   })
// }

};

