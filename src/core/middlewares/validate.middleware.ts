import {  ZodSchema } from "zod";
import { Request,Response,NextFunction } from "express";

export const validate=(schema:ZodSchema)=>
    (req:Request,res:Response,next:NextFunction)=>{
        const result=schema.safeParse(req.body);
  
        if(!result.success){
            console.log(result.error)
            return res.status(400).json({
                success:false,
                errors:result.error
            })
        }

        req.body=result.data;
        next();
}