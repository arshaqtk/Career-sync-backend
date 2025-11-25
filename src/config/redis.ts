import { createClient } from "redis";
import { ENV } from "./env";

const redis=createClient({
    username:ENV.REDIS_USERNAME,
    password:ENV.REDIS_PASSWORD,
    socket:{
        host:ENV.REDIS_HOST,
        port:Number(ENV.REDIS_PORT)
    }
})

redis.on("error",err => console.log('Redis Client Error', err));

redis.connect();

export default redis;