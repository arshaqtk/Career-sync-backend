import { ENV } from "../config/env";
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{

  const token = req.cookies?.accessToken;

    if(!token){
        return res.status(401).json({message:"Access Denied"})
    }
  
     try {
    const decoded = jwt.verify(token, ENV.ACCESS_JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };  

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next()
    }catch(err){
         return res.status(401).json({message:"Invalid token"})   
    } 
}