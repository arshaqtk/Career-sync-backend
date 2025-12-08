import { Schema } from "mongoose";
 export const EducationSchema = new Schema({
  school: {
    type: String,
    required: true,
    trim: true,
  },
  standard: {
    type: String,
    required: true,
    enum: [
      "High School",
      "Higher Secondary",
      "Diploma",
      "Undergraduate",
      "Postgraduate",
      "Doctorate",
      "Other"
    ],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  gradeOrPercentage: {
    type: String, // Example: "8.5 CGPA" or "92%"
  },
});
