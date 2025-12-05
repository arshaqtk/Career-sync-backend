import { IJob } from "./JobModel.type";

export type UpdateJobStatusDTO = Pick<IJob, "status">;