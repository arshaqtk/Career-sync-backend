import { Request, Response, NextFunction } from "express";
import { CustomError } from "../shared/utils/customError";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("❌ ERROR:", err.message);
     console.error("🔥 ERROR NAME:", err.name);
  console.error("🔥 ERROR STACK:", err.stack);
  console.error("🔥 ERROR STATUS:", err.statusCode || err.status);

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
