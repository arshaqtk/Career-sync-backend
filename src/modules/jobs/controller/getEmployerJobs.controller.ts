import { Response,Request } from "express";
import expressAsyncHandler from "express-async-handler";

const getEmployerJobController=expressAsyncHandler(async(req:Request,res:Response)=>{
    const employerId=req.user?.id

    
})