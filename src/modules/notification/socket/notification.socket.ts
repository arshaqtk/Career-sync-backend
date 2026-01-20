import {Server} from "socket.io"

export const emitNotification=(io:Server,
    userId:string,
    payload:{
    type:string,
    title:string,
    message:string,
    entityId?:string,
    createdAt:Date
})=>{
    io.to(`user:${userId}`).emit("notification:new",payload)       
}