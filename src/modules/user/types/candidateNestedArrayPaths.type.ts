import { IEducation, IExperience } from "./user.schema";

// Only paths that are ARRAYS inside user model
export type AllowedNestedArrayPaths =
  | "candidateData.experience"
  | "candidateData.skills"
  | "candidateData.education";

// Type mapping based on path
export type NestedArrayValueType<P extends AllowedNestedArrayPaths> =
  P extends "candidateData.experience" ? IExperience :
  P extends "candidateData.skills" ? string[] :
  P extends "candidateData.education" ? IEducation :
  never;
