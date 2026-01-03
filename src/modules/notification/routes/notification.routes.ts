import { catchAsync } from "../../../middlewares/asyncHandler";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { Router } from "express";
import { getMyNotificationsController, markAllAsReadController } from "../controllers/notification.controller";


const router=Router()

router.get("/",authMiddleware,catchAsync(getMyNotificationsController))
router.patch("/read-all",authMiddleware,catchAsync(markAllAsReadController))

export default router