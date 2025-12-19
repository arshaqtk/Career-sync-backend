import { Schema, Types } from "mongoose";
import {INTERVIEW_STATUS, InterviewStatus}from "../types/interview.type"

export const InterviewStatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(INTERVIEW_STATUS),
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false } 
);
