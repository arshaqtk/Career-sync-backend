// interviewStatusHistory.schema.ts
import { Schema, Types } from "mongoose";
import {InterviewStatus}from "../types/interview.type"

export const InterviewStatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
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
