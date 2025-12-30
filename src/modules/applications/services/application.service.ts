import { jobRepository } from "../../jobs/repository/job.repository";
import { CustomError } from "../../../shared/utils/customError";
import { IApplyJobDTO } from "../dto/applyJob.dto";
import { ApplicationRepository } from "../repository/application.repositories";
import { CandidateApplicationDTO } from "../dto/candiateApplication.dto";
import { RecruiterApplicationDTO } from "../dto/recruiterApplication.dto";
import { IApplicationPopulated } from "../types/applicatioModel.types";
import { APPLICATION_STATUS, ApplicationStatus } from "../types/applicationStatus.types";
import { sendApplicationStatusUpdateEmail } from "./sendEmail.service";
import { ApplicationQuery } from "../types/applicationQuery.types";
import { InterviewRepository } from "../../../modules/Interview/repository/interview.repository";
import { INTERVIEW_STATUS, InterviewRoundType, InterviewStatus } from "../../../modules/Interview/types/interview.type";


const applicationRepository = ApplicationRepository()
const interviewRepository=InterviewRepository()

export const ApplicationService = () => {

  const applyForJob = async (candidateId: string, data: IApplyJobDTO) => {

    if (!candidateId) throw new CustomError("User Not Found", 404)

    const job = await jobRepository.findById(data.jobId);
    if (!job) throw new CustomError("Job not found", 404);

    const existing = await applicationRepository.findOne({
      candidateId,
      jobId: data.jobId
    });
    if (job.status === "closed") {
  throw new CustomError("This job is no longer accepting applications", 410);
}
    if (existing) throw new CustomError("Already applied", 409);
    if(!job.postedBy) throw new CustomError("Something went wrong", 500);

    const application = await applicationRepository.create({
      candidateId,
      recruiterId:job.postedBy as string,
      jobId: data.jobId,
      resumeUrl: data.resumeUrl,
      coverLetter: data.coverLetter,
      currentRole: data.currentRole,
      experience: data.experience,
      noticePeriod:data.noticePeriod,
      expectedSalary:data.expectedSalary,
      status: "Pending"
    });
    if (application) {
      await jobRepository.updateById(data.jobId, { $inc: { applicationCount: 1 } });

    }
    return application
  };

const getMyApplications = async (
  candidateId: string,
  query: ApplicationQuery
): Promise<{
  applications: CandidateApplicationDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  if (!candidateId) {
    throw new CustomError("User Not Found", 404);
  }

  const {
    status,
    sortBy = "newest",
    page = "1",
    limit = "10",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const filter: Record<string, any> = {
    candidateId,
  };

  if (status && status !== "all") {
    filter.status = status;
  }

  const sortOrder = sortBy === "newest" ? -1 : 1;
  const skip = (pageNumber - 1) * limitNumber;


  const [applications, total] = await Promise.all([
    applicationRepository.findMany({
      filter,
      populate: "jobId",
      sort: { createdAt: sortOrder },
      skip,
      limit: limitNumber,
    }),
    applicationRepository.countByQuery(filter),
  ]);

  const mappedApplications: CandidateApplicationDTO[] =
    applications.map((app) => ({
      id: app._id.toString(),
      job: {
        id: (app.jobId as any)._id.toString(),
        title: (app.jobId as any).title,
        company: (app.jobId as any).company,
        location: (app.jobId as any).location,
      },
      status: app.status,
      createdAt: app.createdAt,
    }));

  return {
    applications: mappedApplications,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};


const getCandidateApplicationDetailService = async (applicationId: string)=> {
  if (!applicationId) {
    throw new CustomError("Application ID not found", 400)
  }

  return applicationRepository.getCandidateApplicationDetail(applicationId)


}


//---------------------------------Recruiter----------------------------------------


//get all applications 
const getRecruiterApplications=async(recruiterId:string):Promise <RecruiterApplicationDTO[]> =>{
  
  const applications=await applicationRepository.findMany({
    filter: {
  recruiterId,
  status: { $in: ["Interview", "Selected"] }
} ,populate: [
        { path: "jobId" },
        { path: "candidateId" }
      ]
    }) as unknown as IApplicationPopulated[]
    
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
      currentRole: app.currentRole,
      experience: app.experience,
      status: app.status,
      coverLetter: app.coverLetter,
      expectedSalary: app.expectedSalary,
      noticePeriod: app.noticePeriod,
      createdAt: app.createdAt

    })
    )
  };



  const getApplicationsByJob = async (jobId: string): Promise<RecruiterApplicationDTO[]> => {
    if (!jobId) throw new CustomError("Id Not Found")
    const applications = await applicationRepository.findMany({
      filter: { jobId }, populate: [
        { path: "jobId" },
        { path: "candidateId" }
      ]
    }) as unknown as IApplicationPopulated[]

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
      currentRole: app.currentRole,
      experience: app.experience,
      status: app.status,
      coverLetter: app.coverLetter,
      expectedSalary: app.expectedSalary,
      noticePeriod: app.noticePeriod,
      createdAt: app.createdAt

    })
    )
  };

  const getApplicantDetails = async (applicationId: string) => {

    const applicant = await applicationRepository.findById({
      id: applicationId, populate: [
        {
          path: "candidateId", select: "_id name email phone profilePictureUrl location"
        }, {
          path: "jobId", select: "title company location jobType salary",
        },],
      select: "status resumeUrl coverLetter experience currentRole expectedSalary noticePeriod createdAt"
    });

    if (!applicant) throw new CustomError("Application not found", 404);

    return applicant;
  }



  const updateApplicationStatusService = async (applicationId: string, status: ApplicationStatus) => {
 
    if (!Object.values(APPLICATION_STATUS).includes(status)) {
      throw new CustomError("Invalid application status", 400);
    }

    const application = await applicationRepository.findById(
      {
        id: applicationId, populate: [{ path: "candidateId", select: "name email " }, {
          path: "jobId", select: "title company location jobType",
        },]
      }) as unknown as IApplicationPopulated

    if (!application) { throw new CustomError("Application not found", 404); }

    const updated = await applicationRepository.update(applicationId, { status })



    await sendApplicationStatusUpdateEmail({
      email: application.candidateId?.email,
      candidateName: application.candidateId.name,
      jobTitle: application.jobId.title,
      newStatus: status,
      companyName: application.jobId.company,
      jobLocation: application.jobId.location,
      employmentType: application.jobId.jobType
    });

    return updated
  }



  return {
    applyForJob,
    getCandidateApplicationDetailService,
    getMyApplications,

    getRecruiterApplications,
    getApplicationsByJob,
    getApplicantDetails,
    updateApplicationStatusService
  };
};
