import { Request,Response } from "express"
import { getMyNotifications } from "../services/getNotification.service"
import { CustomError } from "../../../shared/utils/customError"
import { markAllAsRead } from "../services/notificationMarkAllAsRead.service"

export  const getMyNotificationsController=async(req:Request,res:Response)=>{
    const userId=req.user?.id
     const { page = "1", limit = "10" } = req.query;
    if(!userId){ 
            throw new CustomError("Failed To Fetch Notifications")
        }
    const notifications = await getMyNotifications({
    userId,
     query: {
    page: Number(page),
    limit: Number(limit),
  },
  });
    res.status(201).json({ success: true, data:notifications,message:"Notification Fetched Successfully" });
}

export  const markAllAsReadController=async(req:Request,res:Response)=>{
    const userId=req.user?.id
    if(!userId){
            throw new CustomError("Failed To Update Notifications")
        }
    const modifiedCount=await markAllAsRead(userId)
    res.status(201).json({ success: true, data:modifiedCount,message:"Notification Fetched Successfully" });
}