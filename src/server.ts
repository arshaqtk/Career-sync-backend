import { createServer } from "http"
import { connectDB } from "./config/database"
import app from "./app"
import { ENV } from "./config/env"



const PORT=ENV.PORT

const startServer=async()=>{
    await connectDB()
    const httpServer=createServer(app)

    httpServer.listen(PORT,()=>{
        console.log(`CareerSync API running on port ${PORT}`)
    })
}

startServer();