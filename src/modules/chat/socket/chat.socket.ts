import { Server } from "socket.io";
import { createConversation, sendMessage } from "../services/chat.service";
import UserModel from "../../user/models/user.model";

export const chatSocket = (io: Server) => {
    const onlineUsers = new Map<string, number>();
    io.on("connection", async(socket) => {

        const userId = socket.user.id
        socket.join((`user:${userId}`))
        await UserModel.findByIdAndUpdate(userId, {
            isOnline: true,
            lastSeen: null
        });
         socket.broadcast.emit("user-online", { userId });
        onlineUsers.set(userId, (onlineUsers.get(userId) || 0) + 1);
        console.log(`User connected: ${userId}`)

       
        socket.on("chat:joinConversation", async (receiverId: string, callback?: (res: {
            success: boolean,
            conversationId?: string
            message?: string
        }) => void
        ) => {
            try {
                const conversation = await createConversation({ user1: userId, user2: receiverId })
                socket.join(`conversation:${conversation._id}`)

                console.log(
                    `User ${userId} joined room conversation:${conversation._id}`
                )
                callback?.({
                    success: true,
                    conversationId: conversation._id.toString()
                })
            } catch (error) {
                callback?.({
                    success: false,
                    message: "Unable to join conversation",
                })
            }
        })

        socket.on("chat:sendMessage", async (payload: {
            conversationId: string,
            receiverId: string,
            content: string
        }, callback?: (res: {
            success: boolean,
            message?: string
        }) => void) => {
            try {
                const message = await sendMessage({
                    content: payload.content,
                    conversationId: payload.conversationId,
                    senderId: userId,
                    receiverId: payload.receiverId
                })

                io.to(`conversation:${payload.conversationId}`).emit(
                    "chat:newMessage", message)
                callback?.({ success: true })
            } catch (error) {
                callback?.({
                    success: false,
                    message: "Failed to send message",
                })
            }

        })
        socket.on("disconnect", async () => {
            const count = onlineUsers.get(userId)! - 1;
            if (count === 0) {
                onlineUsers.delete(userId);
                await UserModel.findByIdAndUpdate(userId, {
                    isOnline: false,
                    lastSeen: new Date()
                });

                socket.broadcast.emit("user-offline", { userId });
            } else {
                onlineUsers.set(userId, count);
            }
              console.log(`User disconnected from chat socket: ${userId}`)
        })

    })
}