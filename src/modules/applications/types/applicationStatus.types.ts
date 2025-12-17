export const APPLICATION_STATUS = {
  PENDING: "Pending",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  INTERVIEW: "Interview"
} as const;

export type ApplicationStatus =(typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];