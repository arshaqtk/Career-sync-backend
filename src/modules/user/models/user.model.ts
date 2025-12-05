import { Schema, model, Document } from "mongoose";
import { ICandidateData, IRecruiterData } from "../types/user.schema";
export interface IUser extends Document {
  // COMMON FIELDS
  name: string;
  email: string;
  phone?: string;
  password: string;
  profilePictureUrl?: string;

  role: "candidate" | "recruiter" | "admin";
  isVerified: boolean;
  isActive: boolean;

  candidateData?: ICandidateData;
  recruiterData?: IRecruiterData;

  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  location: { type: String },
   jobType:{type:String, enum: ["Onsite", "Hybrid", "Remote"],}
});


const userSchema = new Schema<IUser>(
  {
    // COMMON FIELDS ---------------------------------------------------------
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      minlength: 10,
      maxlength: 15,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    profilePictureUrl: {
      type: String,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // CANDIDATE FIELDS ------------------------------------------------------
    candidateData: {
      about: { type: String },
      resumeUrl: { type: String },
      experience: { type: [ExperienceSchema], default: [] },
      skills: { type: [String], default: [] },
      education: { type: [String], default: [] },
      portfolioUrl: { type: String },
    },


    // RECRUITER FIELDS ------------------------------------------------------
    recruiterData: {
      companyName: { type: String },
      companyWebsite: { type: String },
      companyLogo: { type: String },
      companyLocation: { type: String },
      companyDescription: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;
