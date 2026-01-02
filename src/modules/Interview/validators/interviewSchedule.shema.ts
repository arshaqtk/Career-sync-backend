import {date, z} from "zod"


export const scheduledInterviewSchema=z.object({
    startTime:z.iso.datetime(),
    endTime:z.iso.datetime(),
    roundNumber:z.number().int().min(1),
    roundType:z.enum(["Technical","Hr","Managerial","Final"]),
    mode:z.enum(["Online","Offline"]),
    scheduleMode:z.enum(["initial" , "next_round"]),
meetingLink: z.url().optional(),
    location: z.string().optional(),
}).superRefine((data,ctx)=>{
    if(data.mode==="Online"&&!data.meetingLink){
        ctx.addIssue({
            path:["meetingLink"],
            message:"Meeting link is required for online interview",
            code: z.ZodIssueCode.custom,
        })
    } if (data.mode === "Offline" && !data.location) {
      ctx.addIssue({
        path: ["location"],
        message: "Location is required for offline interview",
        code: z.ZodIssueCode.custom,
      })
    }

    if(new Date(data.endTime)<=new Date(data.startTime)){
ctx.addIssue({
        path: ["endTime"],
        message: "End time must be after start time",
        code: z.ZodIssueCode.custom,
      })
    }
})