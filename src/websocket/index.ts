import {Server} from "socket.io"
import { Server as httpServer } from "http"

export const initSocket=(server:httpServer)=>{
    const io=new Server(server,{
        cors:{
           origin: "http://localhost:5173",
    credentials: true,
        }
    })
    return io
}