import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "candidate" | "hr" | "interviewer" | "admin";
  isActive: boolean;
  isVerified:boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
    },

    role: {
      type: String,
      enum: ["candidate", "hr", "interviewer", "admin"],
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
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;
