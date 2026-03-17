import Route from "express";
import { requireauthMiddleware } from "../../middlewares/requireAuth.middleware";
import { generateCoverLetter } from "./coverLetter.controller";
import { coverLetterLimiter } from "@/middlewares/rateLimiter.middleware";

const router = Route.Router();

router.post("/coverletter/generate", requireauthMiddleware,coverLetterLimiter,generateCoverLetter);

export default router; 