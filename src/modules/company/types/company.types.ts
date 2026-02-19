import { Types } from "mongoose";

export type CompanyVerificationStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ICompany {
  _id?: Types.ObjectId;
  name: string;
  website?: string;
  logo?: {
    key: string;
    url: string;
  };
  location?: string;
  description?: string;
  industry?: string;
  size?: string; 
  foundedYear?: number;

  owner: Types.ObjectId;
  recruiters: Types.ObjectId[];     // All recruiters in this company

  // VERIFICATION ------------------------------------------------
  verificationStatus: CompanyVerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;

  // STATUS CONTROL ----------------------------------------------
  isActive: boolean;               
  blockedAt?: Date;
  blockReason?: string;


  // AUDIT -------------------------------------------------------
  createdAt?: Date;
  updatedAt?: Date;
}
