import { Types } from "mongoose";

export const normalizeFilterIds = (filter: Record<string, any>) => {
  const idFields = ["applicationId", "jobId", "candidateId", "recruiterId"];

  const normalized: Record<string, any> = { ...filter };

  idFields.forEach((field) => {
    if (normalized[field] && typeof normalized[field] === "string") {
      normalized[field] = new Types.ObjectId(normalized[field]);
    }
  });

  return normalized;
};