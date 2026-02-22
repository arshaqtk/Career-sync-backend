import { Schema, model, Document } from "mongoose";
import { ICandidateData, IRecruiterData } from "../types/user.schema";
import { EducationSchema, ExperienceSchema } from "../schemas/index"


export interface IUser extends Document {

  // COMMON FIELDS
  name: string;
  email: string;
  phone?: string;
  profilePicture?: {
    key: string,
    url: string,
    updatedAt: Date
  };

  // AUTH
  password?: string;
  authProvider: "local" | "google"
  googleId?: string;


  field: string | undefined;
  role: "candidate" | "recruiter" | "admin";

  isVerified: boolean;
  isActive: boolean;
  isProfileComplete: boolean;
  isOnline?: boolean;
  lastSeen?: Date;


  blockedAt: Date;
  blockReason?: string;

  candidateData?: ICandidateData;
  recruiterData?: IRecruiterData;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}


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
      minlength: 6,
      select: false,
    },

    profilePicture: {
      key: { type: String },
      url: { type: String },
      updatedAt: { type: Date, default: Date.now }
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String
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
    isProfileComplete: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isOnline: { type: Boolean, default: false },
    lastSeen:{ type: Date },


    blockedAt: {
      type: Date,
    },

    blockReason: {
      type: String,
    },
    field: {
      type: String,
    },

    // CANDIDATE FIELDS ------------------------------------------------------
    candidateData: {
      role: { type: String },
      about: { type: String },
      resume: {
        key: { type: String },
        originalName: { type: String },
        uploadedAt: { type: Date, }
      },
      experience: { type: [ExperienceSchema], default: [] },
      skills: { type: [String], default: [] },
      education: { type: [EducationSchema], default: [] },
      portfolioUrl: { type: String },
    },


    // RECRUITER FIELDS ------------------------------------------------------
    recruiterData: {
      company: { type: Schema.Types.ObjectId, ref: "Company" },
      companyApprovalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
    },
    lastLoginAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;
