import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Authservice } from "../services/auth.service";

export const AuthController = {
    register: asyncHandler(async (req: Request, res: Response) => {
        const result = await Authservice.register(req.body);
        res.status(201).json(result);
        return;
    }),

    login: asyncHandler(async (req: Request, res: Response) => {
        const result = await Authservice.login(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.message,
                status: result.status,
                email: result.email
            });
            return;
        }

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: result.message
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
};
