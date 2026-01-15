import { createServer } from "http"
import { connectDB } from "./config/database"
import app from "./app"
import { ENV } from "./config/env"
import { initSocket } from "./websocket"
import { socketAuth } from "./websocket/auth.middleware"
import { chatSocket } from "./modules/chat/socket/chat.socket"



const PORT=ENV.PORT||5000

const startServer=async()=>{
    await connectDB()
    const httpServer=createServer(app)
    
const io=initSocket(httpServer)
socketAuth(io)
chatSocket(io)

    httpServer.listen(PORT,()=>{
        console.log(`CareerSync API running on port ${PORT}`)
    })
}

startServer();