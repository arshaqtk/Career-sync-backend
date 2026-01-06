import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { getConversationListController, getMessagesController } from "../controllers/chat.controller";


const router=Router()

router.get("/conversations",authMiddleware,catchAsync(getConversationListController))
router.get("/conversations/:conversationId/messages",authMiddleware,catchAsync(getMessagesController))


export default router