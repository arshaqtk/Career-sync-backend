import { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  description?: string;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salary?: string
  location?: string;
  remote?: boolean;
  jobType: "full-time" | "part-time" | "internship";
  postedBy: Schema.Types.ObjectId|string;
  status: "open" | "closed" | "paused";
  applicationCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
