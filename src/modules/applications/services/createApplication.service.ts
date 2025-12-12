import { jobRepository } from "../../jobs/repository/job.repository";
import { CustomError } from "../../../shared/utils/customError";
import { IApplyJobDTO } from "../dto/applyJob.dto";
import { ApplicationRepository } from "../repository/application.repositories";
import { CandidateApplicationDTO } from "../dto/candiateApplication.dto";
import { RecruiterApplicationDTO } from "../dto/recruiterApplication.dto";
import { IApplicationPopulated } from "../types/applicatioModel.types";

const applicationRepository = ApplicationRepository()

export const ApplicationService = () => {

  const applyForJob = async (candidateId: string, data: IApplyJobDTO) => {

    if (!candidateId) throw new CustomError("User Not Found", 404)

    const job = await jobRepository.findById(data.jobId);
    if (!job) throw new CustomError("Job not found", 404);

    const existing = await applicationRepository.findOne({
      candidateId,
      jobId: data.jobId
    });


    if (existing) throw new CustomError("Already applied", 409);

    const application = await applicationRepository.create({
      candidateId,
      jobId: data.jobId,
      resumeUrl: data.resumeUrl,
      coverLetter: data.coverLetter,
      currentRole:data.currentRole,
      experience:data.experience,
      status: "Pending"
    });
    if (application) {
      await jobRepository.updateById(data.jobId, { $inc: { applicationCount: 1 } });

    }
    return application
  };


  const getApplication = async (applicationId: string) => {
    if (!applicationId) throw new CustomError("Id Not Found")
    return await applicationRepository.findById(applicationId);
  };


  const getMyApplications = async (candidateId: string): Promise<CandidateApplicationDTO[]> => {
    if (!candidateId) throw new CustomError("User Not Found")
    const applications = await applicationRepository.findMany({ filter: { candidateId }, populate: "jobId" }) as unknown as IApplicationPopulated[]

    return applications.map((app) => ({
      id: app._id.toString(),
      job: {
        id: app.jobId._id.toString(),
        title: app.jobId.title,
        company: app.jobId.company,
        location: app.jobId.location,
      },
      status: app.status,
      createdAt: app.createdAt,
    }));
  };

  const getApplicationsByJob = async (jobId: string): Promise<RecruiterApplicationDTO[]> => {
    if (!jobId) throw new CustomError("Id Not Found")
    const applications = await applicationRepository.findMany({
      filter: { jobId }, populate: [
        { path: "jobId" },
        { path: "candidateId" }
      ]
    }) as unknown as IApplicationPopulated[]

    console.log(applications)
    return applications.map((app) => ({

      id: app._id.toString(),
      candidate: {
        id: app.candidateId._id,
        name: app.candidateId.name,
        email: app.candidateId.email,
        skills: app.candidateId.candidateData.skills,
        resumeUrl: app.candidateId.candidateData.resumeUrl?.url
      },
      job: {
        id: app.jobId._id,
        title: app.jobId.title,
        company: app.jobId.company
      },
      currentRole:app.currentRole,
      experience: app.experience,
      status: app.status,
      coverLetter: app.coverLetter,
      expectedSalary: app.expectedSalary,
      noticePeriod: app.noticePeriod,
      createdAt: app.createdAt

    })
    )
  };

  return {
    applyForJob,
    getApplication,
    getMyApplications,
    getApplicationsByJob,
  };
};
