import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { loginSchema, passwordSchema, registerSchema } from "../validators/auth.schema";
import { passwordController } from "../controllers/passwordreset.controller";

const router=Router();

router.post("/register",validate(registerSchema),AuthController.register)
router.post("/login",validate(loginSchema),AuthController.login)
router.post("/verify-register-otp", AuthController.verifyRegisterOtp);
router.post("/forgot-password",passwordController.sendForgetPasswordOtp)
router.post("/verify-reset-password",passwordController.verifyResetOtp)
router.post("/reset-password",validate(passwordSchema),passwordController.resetPassword)
router.get("/refresh-token",AuthController.refreshTokens)



export default router