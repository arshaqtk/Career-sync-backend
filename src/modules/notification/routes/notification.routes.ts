import { catchAsync } from "../../../middlewares/asyncHandler";
import { requireauthMiddleware } from "../../../middlewares/requireAuth.middleware";
import { Router } from "express";
import { getMyNotificationsController, markAllAsReadController } from "../controllers/notification.controller";


const router=Router()

router.get("/",requireauthMiddleware,catchAsync(getMyNotificationsController))
router.patch("/read-all",requireauthMiddleware,catchAsync(markAllAsReadController))

export default router