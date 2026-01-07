import { IJob } from "./JobModel.type";

export type UpdateJobStatusDTO = {
    wasClosedByRecruiter:boolean;
    status:"open"| "closed"| "paused"
}
    