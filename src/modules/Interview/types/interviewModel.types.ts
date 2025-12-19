import { Document, Types } from "mongoose";
import { InterviewMode, InterviewRoundType, InterviewStatus } from "./interview.type";

export interface IInterview extends Document{
  candidateId: Types.ObjectId|string;
  // interviewerIds: Types.ObjectId[];
  jobId: Types.ObjectId|string;
  recruiterId: Types.ObjectId|string;
  applicationId: Types.ObjectId|string;
  
  roundType: InterviewRoundType;
  
  startTime: Date;
  endTime: Date;
  durationMinutes?: number;
  
  status:  InterviewStatus;
  statusHistory?: {
    changedBy: Types.ObjectId|string;
  status: InterviewStatus;
  changedAt: Date;
  note?: string;
}[];

  mode?: InterviewMode;
  meetingLink?: string;
  location?: string; 
 

  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}
