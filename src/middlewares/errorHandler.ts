import { Request, Response, NextFunction } from "express";
import { CustomError } from "../shared/utils/customError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as any).statusCode || (err as any).status || 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  console.error("❌ ERROR:", message);
  console.error("🔥 ERROR NAME:", (err as any).name);
  console.error("🔥 ERROR STACK:", (err as any).stack);
  console.error("🔥 ERROR STATUS:", statusCode);

    // If it is our custom error
    if (err instanceof CustomError) {
         console.error("❌ ERROR:", err.message);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details || null
        });
    }

    // Unexpected server error
    return res.status(500).json({ 
        success: false,
        message: "Internal server error"
    });
};
