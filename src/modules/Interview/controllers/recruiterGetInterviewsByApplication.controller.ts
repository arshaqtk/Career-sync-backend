import { Request,Response } from "express";
import { recruiterGetInterviewsByApplicationId } from "../services/recruiterGetInterviewsByApplicationId.service";

export const recruiterGetInterviewsByApplicationController=async(req:Request,res:Response)=>{
    const recruiterId=String(req.auth?.id)
     const  applicationId  = String(req.params.applicationId)

  const response=await recruiterGetInterviewsByApplicationId({applicationId:String(applicationId),recruiterId:String(recruiterId)})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}
