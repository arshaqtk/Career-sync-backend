import { Types } from "mongoose";
import { InterviewMode, InterviewRoundType, InterviewStatus } from "./interview.type";

export interface InterviewPopulated {
  _id: Types.ObjectId;

  candidateId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };

  jobId: {
    _id: Types.ObjectId;
    title: string;
    company: string;
  };

  recruiterId: Types.ObjectId;
  applicationId: Types.ObjectId;

  roundType: InterviewRoundType;
  startTime: Date;
  endTime: Date;
  durationMinutes?: number;
roundNumber:number;

  status: InterviewStatus;
  statusHistory?: {
    roundNumber:number;
    changedBy: Types.ObjectId;
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