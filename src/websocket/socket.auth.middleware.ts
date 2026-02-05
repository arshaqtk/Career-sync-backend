import { ENV } from "../config/env"
import { CustomError } from "../shared/utils/customError"
import * as cookie from "cookie"
import jwt from "jsonwebtoken"
import type { Socket,Server } from "socket.io"
interface AuthJwtPayload extends jwt.JwtPayload {
  id: string
  role: "admin" | "recruiter" | "candidate"
  email?:string
}

export const socketAuth=(io:Server)=>{
    io.use((socket:Socket,next:(err?: Error) => void)=>{
        try{
          const cookieHeader=socket.handshake.headers.cookie
         
            if(!cookieHeader){
                return next(new Error("No cookie"))
            }
 const cookies = cookie.parse(cookieHeader)
             const token = cookies.accessToken
            if(!token){
                throw new CustomError("unAuthorized  Token Not Found");
            }

            const decoded=jwt.verify(token,ENV.ACCESS_JWT_SECRET) as AuthJwtPayload
            socket.user={
  id: decoded.id,
  role: decoded.role,
  email:decoded.email
}
        
         next()   
    } catch(err) {
       console.error("SOCKET AUTH ERROR:", err)
      next(new CustomError("Invalid token"))
    }
    }) 
} 