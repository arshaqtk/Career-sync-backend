import { InterviewRoundType } from "./interview.type";

export interface ScheduleInterview  {
  startTime: string;   
  endTime: string;     
  roundNumber: number;

  mode: "Online" | "Offline";
  meetingLink?: string;
  location?: string;
  interviewerEmail?:string;
  interviewerName?:string;
  roundType:InterviewRoundType;
    scheduleMode: "initial" | "reschedule" | "next_round";
};