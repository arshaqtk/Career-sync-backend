import { Response,Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { getEmployerJobService } from "../services/getEmployerJob.service";
import { CustomError } from "../../../shared/utils/customError";

export const getEmployerJobController=expressAsyncHandler(async(req:Request,res:Response)=>{
    if(!req.user?.id){
         throw new CustomError("unAuthorized",401)
    }
    const employerId:string=req.user.id

    const jobs=await getEmployerJobService(employerId)
     res.status(200).json(jobs);

})