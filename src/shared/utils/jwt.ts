import jwt from "jsonwebtoken"
import { ENV } from "../../config/env";
import { CustomError } from "./customError";

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

export const verifyRefreshToken = (refreshToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      ENV.REFRESH_JWT_SECRET as string,
      async (err, decoded: any) => {
        if (err) {
          return reject(new CustomError("Invalid or expired session", 403));
        }
        const {id,email,role}=decoded
        const accessToken = await generateAccessToken({id,email,role});
        resolve(accessToken);
      }
    );
  });
};

export const generateTokens = (payload: any) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};