import jwt from "jsonwebtoken"
import { ENV } from "../../config/env";
import { CustomError } from "./customError";
import { Types } from "mongoose";

export interface JWTPayload {
  id: string | Types.ObjectId;
  email: string;
  role: string;
  [key: string]: unknown;
}
export const generateAccessToken = (payload: JWTPayload) => {
  return jwt.sign(payload, ENV.ACCESS_JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(payload, ENV.REFRESH_JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (refreshToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      ENV.REFRESH_JWT_SECRET as string,
      async (err, decoded: unknown) => {
        if (err || !decoded) {
          return reject(new CustomError("Invalid or expired session", 403));
        }
        const { id, email, role } = decoded as JWTPayload;
        const accessToken = await generateAccessToken({ id, email, role });
        resolve(accessToken);
      }
    );
  });
};

export const generateTokens = (payload: JWTPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};