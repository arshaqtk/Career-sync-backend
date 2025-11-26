import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../../../core/middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.schema";

const router=Router();

router.post("/register",validate(registerSchema),AuthController.register)
router.post("/login",validate(loginSchema),AuthController.login)
router.post("/verify-otp", AuthController.verifyOtp);

export default router