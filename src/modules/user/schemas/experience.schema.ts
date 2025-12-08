import { Schema } from "mongoose";

export const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  location: { type: String },
   jobType:{type:String, enum: ["Onsite", "Hybrid", "Remote"],}
});

