export interface ScheduleInterview  {
  startTime: string;   
  endTime: string;     
  timezone: string;
  mode: "Online" | "Offline";
  meetingLink?: string;
  location?: string;
};