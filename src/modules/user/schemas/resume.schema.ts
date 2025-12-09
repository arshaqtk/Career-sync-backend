import { Schema } from "mongoose";

export const ResumeSchema = new Schema({
  url: String,
  originalName: String,
  uploadedAt: Date
});