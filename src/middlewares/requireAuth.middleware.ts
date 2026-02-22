import { ENV } from "../config/env";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../modules/user/models/user.model";

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

    // Fetch user from DB to ensure session is still valid and status is active
    const user = await UserModel.findById(decoded.id).select("role isActive blockedAt blockReason recruiterData");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: user.blockReason
          ? `Your account has been blocked. Reason: ${user.blockReason}`
          : "Your account has been blocked."
      });
    }

    // Recruiter approval check
    if (user.role === "recruiter" &&
      user.recruiterData?.company &&
      user.recruiterData?.companyApprovalStatus === "pending") {

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
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};