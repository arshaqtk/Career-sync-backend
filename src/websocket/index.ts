import {Server} from "socket.io"
import { Server as httpServer } from "http"

export const initSocket=(server:httpServer)=>{
    const io=new Server(server,{
        cors:{
           origin: "https://career-sync-frontend.vercel.app",
    credentials: true,
        }
    })
    return io
}