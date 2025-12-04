import { JobModel } from "../models/job.model";
import { IJob } from "../types/JobModel.type";

export const jobRepository={
    createJob:(data: IJob) => {
    return JobModel.create(data);
  },
}