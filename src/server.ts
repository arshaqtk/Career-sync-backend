import { createServer } from "http"
import { connectDB } from "./config/database"
import app from "./app"
import { ENV } from "./config/env"
import { initSocket } from "./websocket"
import { socketAuth } from "./websocket/auth.middleware"



const PORT=ENV.PORT

const startServer=async()=>{
    await connectDB()
    const httpServer=createServer(app)
    
const io=initSocket(httpServer)
socketAuth(io)

    httpServer.listen(PORT,()=>{
        console.log(`CareerSync API running on port ${PORT}`)
    })
}

startServer();