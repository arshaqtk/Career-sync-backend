import { Types } from "mongoose";
import { InterviewRoundType, InterviewStatus } from "../types/interview.type";

export type InterviewDetails = {
  _id: string;
  candidate: {
    _id: string;
    name: string;
    email: string;
  };
  job: {
    _id: string;
    title: string;
  };
  roundType: InterviewRoundType;
  roundNumber: number;
  mode?: "Online" | "Offline";
  startTime?: string;
  endTime?: string;
  meetingLink?: string;
  status: InterviewStatus;
  
  statusHistory?: {
   changedBy: Types.ObjectId|string;
   roundNumber: number;
     status: InterviewStatus;
     changedAt: Date;
     note?: string;
  }[];
  notes?: string;
};
