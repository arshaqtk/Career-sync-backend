import { ENV } from "../config/env";
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";


export const optionAuthMiddleware=(req:Request,res:Response,next:NextFunction)=>{

  const token = req.cookies?.accessToken;

if(token){
     try {
    const decoded = jwt.verify(token, ENV.ACCESS_JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };  

    (req as any).auth = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    
    return next()
    }catch(err){
         return res.status(401).json({message:"Invalid token"})   
    } 
}
  next()
}