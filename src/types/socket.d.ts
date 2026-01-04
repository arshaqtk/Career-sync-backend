import "socket.io"

declare module "socket.io"{
    interface Socket{
        user:{
            id:string;
            role: "admin" | "recruiter" | "candidate"
            email?: string
        }
    }
}