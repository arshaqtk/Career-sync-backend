import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Authservice } from "../services/auth.service";
import { CustomError } from "../../../shared/utils/customError";
import { OAuthIdentity } from "../types/auth.types";

export const AuthController = {
    register: asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body)
        const result = await Authservice.register(req.body);
        res.status(201).json(result);
        return;
    }),   

    login: asyncHandler(async (req: Request, res: Response) => {
        const result = await Authservice.login(req.body);
 
        if (!result.success) {
            res.status(200).json({
                success: false,
                message: result.message,
                user: {
                    status: result.status,
                    email: result.email,
                    isVerified: result.isVerified
                }
            });
            return;

        }

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: true,
           sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
           sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({
            success: true,
            message: result.message,
            user: {
                id:result.id,
                role:result.role,
                status: result.status,
                email: result.email,
                isVerified: result.isVerified
            }
        });
        return;

    }),

     googleCallback:async(req:Request, res:Response)=>{
        
  if (!req.user) {
    throw new CustomError("OAuth authentication failed", 401)
  }
        const identity=req.user as OAuthIdentity
    const result = await Authservice.oauthLogin(identity)

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: true,
           sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
           sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
if(result.success){
    if(result.role=="candidate"){
        res.redirect(`${process.env.CLIENT_URL}/home`)
    }
    if(result.role=="recruiter"){
        res.redirect(`${process.env.CLIENT_URL}/recruiter`)
    }
}

 res.status(200).json({
            success: true,
            message: result.message,
            user: {
                id:result.id,
                role:result.role,
                status: result.status,
                email: result.email,
                isVerified: result.isVerified
            }
        });
  },

    verifyRegisterOtp: asyncHandler(async (req: Request, res: Response) => { 
        const { email, otp } = req.body;
        const result = await Authservice.verifyRegisterOtp(email, otp);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.message
            });
            return;
        }

        res.json({
            success: true,
            message: "OTP verified successfully",
        });
        return;
    }),

    resendOtp:asyncHandler(async(req:Request,res:Response)=>{
        const {email}=req.body

         const result = await Authservice.resendRegisterOtp(email);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.message
            });
            return;
        }

        res.json({
            success: true,
            message: "OTP verified successfully",
        });
        return;

    }),
    refreshTokens: asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw new CustomError("Token Is Not Found", 404)
        }
        const accessToken = await Authservice.refreshTokens(refreshToken)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: "Token refreshed successfully" });

    }),
    logout: asyncHandler(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true, // change to true in production
        sameSite: "none",
        path: "/",
    });

    
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true, // change to true in production
        sameSite: "none",
        path: "/",
    });

    
     res.status(204).send();
})

};
