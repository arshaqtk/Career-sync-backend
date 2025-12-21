import { InterviewRoundType } from "./interview.type";

export interface ScheduleInterview  {
  startTime: string;   
  endTime: string;     
  roundNumber: number;
  timezone: string;
  mode: "Online" | "Offline";
  meetingLink?: string;
  location?: string;
  roundType:InterviewRoundType;
    scheduleMode: "initial" | "reschedule" | "next_round";
};