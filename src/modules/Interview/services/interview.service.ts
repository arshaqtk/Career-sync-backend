import { CustomError } from "../../../shared/utils/customError"
import { RecruiterInterviewsDTO } from "../dto/recruiter.allInterviews.dto"
import { InterviewDetails } from "../dto/recruiter.interviewDetail.dto"
import { InterviewRepository } from "../repository/interview.repository"
import { InterviewQuery } from "../types/interview.query.type"

const interviewRepository = InterviewRepository()

export const InterviewServices = () => {

    const recruiterGetInterviews = async (recruiterId: string, query: InterviewQuery):Promise<RecruiterInterviewsDTO[]> => {
        if (!recruiterId) throw new CustomError("User Not Found", 404)

        const { status, sortBy = "newest",   page = "1", limit = "10", roundType } = query;

        const filter: Record<string, any> = {
            recruiterId,
        };

        if (status && status !== "All") {
            filter.status = status;
        }
        if (roundType && roundType != "All") {
            filter.roundType = roundType
        }
        const sortOrder = sortBy === "newest" ? -1 : 1;

        const skip = (Number(page) - 1) * Number(limit);

        const interviews = await interviewRepository.findMany({
            filter,
            populate:[{path:"candidateId", select:"name"},{path:"jobId",select:"title"}],
            sort:{createdAt:sortOrder},
            skip,
            limit:Number(limit)
        })

        return interviews.map((interview)=>({
            id:interview._id.toString(),
            candidateName:(interview.candidateId as any).name,
            jobTitle:(interview.jobId as any).title,
            roundType:interview.roundType,
            status:interview.status,
            createdAt:interview.createdAt,
        }))

    }

    const recruiterGetInterviewById=async(interviewId:string):Promise<InterviewDetails>=>{
        const interview=await interviewRepository.findById({id:interviewId,populate:[{path:"candidateId" ,select:"_id name email"},
            {path:"jobId" , select:"_id title"}]})

        console.log(interview)
        return {
            _id:interview._id.toString(),
            candidate:{
                _id:(interview?.candidateId as any)._id,
                name:(interview?.candidateId as any).name,
                email:(interview?.candidateId as any).email
            },
            job:{
                _id: (interview?.jobId as any)._id,
                title:(interview?.jobId as any).title

            },
            roundType:interview.roundType,
            startTime:interview.startTime?.toString(),
            endTime:interview.endTime?.toString(),
            meetingLink:interview.meetingLink,
            status:interview.status,
            statusHistory:interview.statusHistory,
            notes:interview.notes,
            mode:interview.mode
        }
    }
    return {
        recruiterGetInterviews,
        recruiterGetInterviewById
    }
}