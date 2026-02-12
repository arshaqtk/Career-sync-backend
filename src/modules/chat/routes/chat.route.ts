import { catchAsync } from "../../../middlewares/asyncHandler";
import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { Router } from "express";
import { getConversationListController } from "../controllers/getConversationList.controller";
import { getMessagesController } from "../controllers/getMessages.controller";
import { clearMessageController } from "../controllers/clearMessage.controller";
import { deleteConversationController } from "../controllers/deleteMessages.controller";



const router=Router()

router.get("/conversations",requireauthMiddleware,catchAsync(getConversationListController))
router.get("/conversations/:conversationId/messages",requireauthMiddleware,catchAsync(getMessagesController))
router.delete("/conversations/:conversationId/messages",requireauthMiddleware,catchAsync(clearMessageController))
router.delete("/conversations/:conversationId",requireauthMiddleware,catchAsync(deleteConversationController))



export default router