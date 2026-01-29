import {Server} from "socket.io"
import { Server as httpServer } from "http"

export const initSocket=(server:httpServer)=>{
    const io=new Server(server,{
        cors:{
           origin: "https://career-sync-ten.vercel.app",
    credentials: true,
        }
    })
    return io
}