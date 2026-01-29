import { catchAsync } from "../../../middlewares/asyncHandler";
import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { Router } from "express";
import { clearMessageController, deleteConversationController, getConversationListController, getMessagesController } from "../controllers/chat.controller";


const router=Router()

router.get("/conversations",requireauthMiddleware,catchAsync(getConversationListController))
router.get("/conversations/:conversationId/messages",requireauthMiddleware,catchAsync(getMessagesController))
router.delete("/conversations/:conversationId/messages",requireauthMiddleware,catchAsync(clearMessageController))
router.delete("/conversations/:conversationId",requireauthMiddleware,catchAsync(deleteConversationController))



export default router