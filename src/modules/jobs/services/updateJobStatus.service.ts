import { CustomError } from "../../../shared/utils/customError"
import { jobRepository } from "../repository/job.repository"
import { UpdateJobStatusDTO } from "../types/jobStatus.types";

interface UpdateJobStatus{
    data:UpdateJobStatusDTO;
    employerId:string;
    jobId:string;
}
export const updateJobStatusService = async ({
  data,
  employerId,
  jobId,
}: UpdateJobStatus) => {
  const job = await jobRepository.findOneByQuery({
    _id: jobId,
    postedBy: employerId,
  })

  if (!job) {
    throw new CustomError(
      "Job not found or you are not allowed to update this job",
      403
    )
  }

  
  if (job.status === "paused") {
    throw new CustomError(
      "This job is blocked by admin and cannot be modified",
      403
    )
  }

  if (Object.keys(data).length === 0) {
    throw new CustomError("No update data provided", 400)
  }

  
  if (data.status && !["open", "closed"].includes(data.status)) {
    throw new CustomError("Invalid status update", 400)
  }

  if (data.status === "closed") {
  data.wasClosedByRecruiter = true
}
if (data.status === "closed") {
  data.wasClosedByRecruiter = true
}
  return jobRepository.updateById(jobId, {
    $set: data,
  })
}
