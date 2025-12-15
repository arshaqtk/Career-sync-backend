export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  SHORTLISTED: "SHORTLISTED",
  REJECTED: "REJECTED",
  INTERVIEW: "INTERVIEW"
} as const;

export type ApplicationStatus = keyof typeof APPLICATION_STATUS;