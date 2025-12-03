import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 8000,
  MONGO_URI: process.env.MONGO_URI || "",
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET || "",
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || "",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  MAIL_HOST: process.env.MAIL_HOST || "",
  MAIL_PORT: process.env.MAIL_PORT || "",
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASS: process.env.MAIL_PASS || "",
  MAIL_FROM: process.env.MAIL_FROM || "",

  REDIS_USERNAME:process.env.REDIS_USERNAME,
REDIS_PASSWORD:process.env.REDIS_PASSWORD,
REDIS_HOST:process.env.REDIS_HOST,
REDIS_PORT:process.env.REDIS_PORT,


CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
}