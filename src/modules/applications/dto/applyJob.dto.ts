export interface IApplyJobDTO {
  jobId: string;
  resumeUrl: string;
  coverLetter?: string;
  experience:string;
  currentRole:string;
  expectedSalary?: number;
  noticePeriod?: string;
}