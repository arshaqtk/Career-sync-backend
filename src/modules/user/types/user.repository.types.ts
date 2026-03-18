import { IUser, IRecruiterData } from "./user.schema";

type BaseCreateUserDTO = Pick<IUser,"name" | "email" | "role"| "isVerified"|"isProfileComplete">;

export type CreateLocalUserDTO = BaseCreateUserDTO & {
  authProvider: "local";
  password: string;
   field: string;
   recruiterData?: IRecruiterData;
};


export type CreateOAuthUserDTO = BaseCreateUserDTO & {
  authProvider: "google";
  googleId?: string;
  field?: undefined;
}; 

export type CreateUserDTO = CreateLocalUserDTO| CreateOAuthUserDTO;