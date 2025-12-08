import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Authservice } from "../services/auth.service";
import { CustomError } from "../../../shared/utils/customError";

export const AuthController = {
    register: asyncHandler(async (req: Request, res: Response) => {
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
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({
            success: true,
            message: result.message,
            user: {
                role:result.role,
                status: result.status,
                email: result.email,
                isVerified: result.isVerified
            }
        });
        return;

    }),

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

    refreshTokens: asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw new CustomError("Unauthorized", 404)
        }
        const accessToken = await Authservice.refreshTokens(refreshToken)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: "Token refreshed successfully" });

    }),
    logout: asyncHandler(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false, // change to true in production
        sameSite: "lax",
        path: "/",
    });

    
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false, // change to true in production
        sameSite: "lax",
        path: "/",
    });

    
     res.status(204).send();
})

};
