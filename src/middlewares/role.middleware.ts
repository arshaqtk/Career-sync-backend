import { Request,Response,NextFunction } from "express";
type Role = "recruiter" | "admin" | "candidate";
export const authorizeRoles=(...roles:Role[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const user=(req as any).auth as { role: Role } | undefined;

        if(!user ||!roles.includes(user.role)){
             return res.status(403).json({ message: "Forbidden: You do not have the required role" });
        }
        next()
    }
}