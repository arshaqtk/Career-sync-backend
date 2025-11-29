import jwt from "jsonwebtoken"
import { ENV } from "../config/env";

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, ENV.ACCESS_JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, ENV.REFRESH_JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const generateTokens = (payload: any) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};