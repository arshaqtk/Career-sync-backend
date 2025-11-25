import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB=async()=>{
    try{
        const connect= mongoose.connect(ENV.MONGO_URI!)
        console.log("Mongodb connected")
    }catch(err:any){
        console.error("MongoDB connection error:",err.message)
        process.exit(1);
    }
}