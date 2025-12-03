import { Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  description?: string;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryRange?: {
    min: number;
    max: number;
  };
  location?: string;
  remote?: boolean;
  jobType: "full-time" | "part-time" | "internship";
  postedBy: Types.ObjectId;
  status: "open" | "closed" | "paused";
  applicationCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
