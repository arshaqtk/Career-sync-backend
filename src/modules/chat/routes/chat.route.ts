import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { getConversationListController } from "../controllers/chat.controller";


const router=Router()

router.get("/conversations",authMiddleware,catchAsync(getConversationListController))

export default router