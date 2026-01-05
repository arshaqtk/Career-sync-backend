import { Server } from "socket.io";
import { createConversation, sendMessage } from "../services/chat.service";

export const chatSocket = (io: Server) => {
    io.on("connection", (socket) => {


        const userId = socket.user.id
        socket.join((`user:${userId}`))
        console.log(`User connected to chat socket: ${userId}`)

        /**
             Join (or create) a conversation room
             Frontend sends receiverId
            */
        socket.on("chat:joinConversation", async (receiverId: string, callback?: (res: {
            success: boolean,
            conversationId?: string
            message?: string
        }) => void
        ) => {
            try {
                console.log("hitted")
                console.log(userId,receiverId)

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
                console.log(payload)
                const message = await sendMessage({
                    content: payload.content,
                    conversationId: payload.conversationId,
                    senderId: userId,
                    receiverId: payload.receiverId
                })

                io.to(`conversation:${payload.conversationId}`).emit(
                    "chat:newMessage",message)
                    callback?.({success:true})
            }  catch (error) {
          callback?.({
            success: false,
            message: "Failed to send message",
          }) 
        }

        })
  socket.on("disconnect", () => {
      console.log(`User disconnected from chat socket: ${userId}`)
    })

    })
}