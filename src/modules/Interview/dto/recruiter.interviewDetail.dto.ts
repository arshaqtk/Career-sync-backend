import { Types } from "mongoose";
import { InterviewStatus } from "../types/interview.type";

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
  roundType: string;
  mode?: "Online" | "Offline";
  startTime?: string;
  endTime?: string;
  meetingLink?: string;
  status: InterviewStatus;
  statusHistory?: {
   changedBy: Types.ObjectId|string;
     status: InterviewStatus;
     changedAt: Date;
     note?: string;
  }[];
  notes?: string;
};
