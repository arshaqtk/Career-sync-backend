import { Document, Schema, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  company:Types.ObjectId
  description?: string;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salary?: number;
  field: string; 
  location?: string;
  remote?: boolean;
  jobType: "full-time" | "part-time" | "internship";
  postedBy: Types.ObjectId
  status: "open" | "closed" | "paused"; 
  applicationCount?: number;
   blockedAt:Date|null;
  blockReason?:string|null;
  wasClosedByRecruiter:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
