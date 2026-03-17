import { CustomError } from "../shared/utils/customError";
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true, // Returns rate limit info in headers
  legacyHeaders: false,
  handler:(req,res,next)=>{
    next(new CustomError("Too many requests, please try again later.",429))
  }
})

export const coverLetterLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,  // 24 hours (was 15 * 60 * 1000)
  max: 5,                          // 5 per day
  keyGenerator: (req) => (req as any).user?.id || req.ip,  // per user not per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new CustomError("You have reached your daily limit of 5 cover letters. Please try again tomorrow.", 429));
  }
});