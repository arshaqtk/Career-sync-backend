import { ENV } from "../config/env";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../modules/user/models/user.model";
import redis from "@/config/redis";

export const requireauthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };

    const cacheKey=`auth:user:${decoded.id}`;
    const cachedUser=await redis.get(cacheKey)

    let userData;

    if(cachedUser){
      userData=JSON.parse(cachedUser)
    }else{

      const user = await UserModel.findById(decoded.id).select("role isActive blockedAt blockReason recruiterData");
     
      if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    userData={
       id: user._id.toString(),
        role: user.role,
        isActive: user.isActive,
        blockReason: user.blockReason,
        companyApprovalStatus:user.recruiterData?.companyApprovalStatus || null
      };

      await redis.set(cacheKey,JSON.stringify(userData),{EX:600})
    }

 
  
  if (!userData.isActive) {
    return res.status(403).json({
      message: userData.blockReason
        ? `Your account has been blocked. Reason: ${userData.blockReason}`
        : "Your account has been blocked."
    });
  }
    // Recruiter approval check
    if (userData.role === "recruiter" &&
      userData.recruiterData?.company &&
      userData.recruiterData?.companyApprovalStatus === "pending") {

      // Allow them to access the profile, logout, and company onboarding routes
      const allowedPaths = ["/onboarding", "/profile", "/logout", "/companies/search", "/companies/join", "/companies"];
      const isAllowed = allowedPaths.some(p => req.originalUrl.includes(p));

      if (!isAllowed) {
        return res.status(403).json({
          message: "Your joining request is pending approval from the company owner.",
          status: "PENDING_APPROVAL"
        });
      }
    }

    (req as any).auth = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};