import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { loginSchema, passwordSchema, registerSchema } from "../validators/auth.schema";
import { passwordController } from "../controllers/passwordreset.controller";
import passport from "passport";

const router=Router();


router.post("/register",validate(registerSchema),AuthController.register)
router.post("/login",validate(loginSchema),AuthController.login)
router.get("/google",passport.authenticate("google", {scope: ["profile", "email"],}))
router.get("/google/callback",passport.authenticate("google", { session: false }),AuthController.googleCallback)
router.post("/logout",AuthController.logout)
router.post("/verify-register-otp", AuthController.verifyRegisterOtp);
router.post("/resend-register-otp",AuthController.resendOtp)
router.post("/forgot-password",passwordController.sendForgetPasswordOtp) 
router.post("/resend-forgot-password-otp",passwordController.sendForgetPasswordOtp)
router.post("/verify-reset-password",passwordController.verifyResetOtp)
router.post("/reset-password",validate(passwordSchema),passwordController.resetPassword)
router.get("/refresh-token",AuthController.refreshTokens)



 
export default router