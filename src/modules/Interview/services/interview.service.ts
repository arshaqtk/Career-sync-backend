import path from "path"
import { CustomError } from "../../../shared/utils/customError"
import { RecruiterInterviewsDTO } from "../dto/recruiter.allInterviews.dto"
import { InterviewDetails } from "../dto/recruiter.interviewDetail.dto"
import { InterviewRepository } from "../repository/interview.repository"
import { InterviewQuery } from "../types/interview.query.type"
import { INTERVIEW_STATUS, InterviewStatus } from "../types/interview.type"
import { ScheduleInterview } from "../types/interviewSchedule.type"
import { sendInterviewEmail } from "./interviewEmail.service"
import { formatInterviewDateTime } from "../../../shared/utils/dateFormatter"
import { InterviewPopulated } from "../types/interview.populated.type"
import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { APPLICATION_STATUS } from "../../../modules/applications/types/applicationStatus.types"
import mongoose from "mongoose"

const interviewRepository = InterviewRepository();
const applicationRepository = ApplicationRepository();

export const InterviewServices = () => {

    const recruiterGetInterviews = async (recruiterId: string, query: InterviewQuery): Promise<RecruiterInterviewsDTO[]> => {
        if (!recruiterId) throw new CustomError("Required identifier not found", 400);

        const { status, sortBy = "newest", page = "1", limit = "10", roundType } = query;

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
        console.log(recruiterId)
        const interviews = await interviewRepository.findLatestByActor({
            actorField: "recruiterId",
            actorId: recruiterId,
            filter,
            populate: [
                { path: "candidateId", select: "name" },
                { path: "jobId", select: "title" },
            ],
            sort: { createdAt: sortOrder },
            skip,
            limit: Number(limit),
        });

        console.log(interviews)

        return interviews.map((interview) => ({
            id: interview._id.toString(),
            candidateName: (interview.candidateId as any).name,
            jobTitle: (interview.jobId as any).title,
            roundType: interview.roundType,
            roundNumber: interview.roundNumber,
            status: interview.status,
            createdAt: interview.createdAt,
        }))

    }

    const recruiterGetInterviewById = async (interviewId: string): Promise<InterviewDetails> => {
        console.log(interviewId)
        if (!interviewId) {
            throw new CustomError("Required identifier not found", 400);
        }
        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            throw new CustomError("Invalid interview id", 400)
        }
        const interview = await interviewRepository.findById({
            id: interviewId, populate: [{ path: "candidateId", select: "_id name email" },
            { path: "jobId", select: "_id title" }]
        })
        if (!interview) {
            throw new CustomError("Interview  not found", 404);

        }
        return {
            _id: interview._id.toString(),
            candidate: {
                _id: (interview?.candidateId as any)._id,
                name: (interview?.candidateId as any).name,
                email: (interview?.candidateId as any).email
            },
            job: {
                _id: (interview?.jobId as any)._id,
                title: (interview?.jobId as any).title

            },
            roundType: interview.roundType,
            roundNumber: interview.roundNumber,
            startTime: interview.startTime?.toString(),
            endTime: interview.endTime?.toString(),
            meetingLink: interview.meetingLink,
            status: interview.status,
            statusHistory: interview.statusHistory,
            notes: interview.notes,
            mode: interview.mode
        }
    }

    const recruiterScheduleInterview = async ({
        recruiterId,
        applicationId,
        payload,
        type, // "initial" | "next_round"
    }: {
        recruiterId: string;
        applicationId: string;
        payload: ScheduleInterview;
        type: "initial" | "next_round";
    }) => {

        if (!recruiterId || !applicationId) {
            throw new CustomError("Recruiter ID or application ID missing", 400);
        }

        const application = await applicationRepository.findById({
            id: applicationId,
            populate: [
                { path: "candidateId", select: "name email" },
                { path: "jobId", select: "company title" },
            ],
        });

        if (!application) throw new CustomError("Application not found", 404);

        if (application.recruiterId.toString() !== recruiterId) {
            throw new CustomError("Access denied", 403);
        }


        if (payload.mode === "Offline" && !payload.location) {
            throw new CustomError("Location required for offline interview", 400);
        }

        if (payload.mode === "Online" && !payload.meetingLink) {
            throw new CustomError("Meeting link required for online interview", 400);
        }

        const start = new Date(payload.startTime);
        const end = new Date(payload.endTime);

        if (end <= start) {
            throw new CustomError("End time must be after start time", 400);
        }

        // 🔹 Next round specific rules
        if (type === "next_round") {
            const lastInterview =
                await interviewRepository.findLatestRound(applicationId);

            if (!lastInterview) {
                throw new CustomError("No previous interview found", 400);
            }

            if (lastInterview.status !== INTERVIEW_STATUS.COMPLETED) {
                throw new CustomError(
                    "Previous round must be completed",
                    400
                );
            }

            if (payload.roundNumber !== lastInterview.roundNumber + 1) {
                throw new CustomError("Invalid next round number", 400);
            }
        }

        //  Initial scheduling rule
        if (type === "initial" && payload.roundNumber !== 1) {
            throw new CustomError("Initial interview must be round 1", 400);
        }

        await applicationRepository.update(applicationId, {
            status: APPLICATION_STATUS.INTERVIEW,
        });

        const interview = await interviewRepository.create({
            candidateId: application.candidateId,
            applicationId,
            jobId: application.jobId,
            recruiterId: application.recruiterId,

            startTime: start,
            endTime: end,
            roundNumber: payload.roundNumber,
            roundType: payload.roundType,
            mode: payload.mode,
            meetingLink:
                payload.mode === "Online" ? payload.meetingLink : undefined,
            location:
                payload.mode === "Offline" ? payload.location : undefined,

            status: INTERVIEW_STATUS.SCHEDULED,
            statusHistory: [
                {
                    status: INTERVIEW_STATUS.SCHEDULED,
                    changedBy: recruiterId,
                    changedAt: new Date(),
                    note:
                        type === "next_round"
                            ? "Next round scheduled"
                            : "Interview scheduled",
                    roundNumber: payload.roundNumber,
                },
            ],
        });

        return interview;
    };


    //------------------------Update interview Round Status----------------------------------------------
    const recruiterUpdateInterviewStatus = async ({
        recruiterId,
        interviewId,
        payload,
    }: {
        recruiterId: string;
        interviewId: string;
        payload: {
            status:
            | typeof INTERVIEW_STATUS.COMPLETED
            | typeof INTERVIEW_STATUS.CANCELLED
            | typeof INTERVIEW_STATUS.IN_PROGRESS;
            note?: string;
            roundNumber: number;
        };

    }) => {
        let { status, note, roundNumber } = payload;
        if (!recruiterId || !interviewId) {
            throw new CustomError("Recruiter ID or Interview ID is missing", 400);
        }

        const interview = await interviewRepository.findById({ id: interviewId });

        if (!interview) {
            throw new CustomError("Interview not found", 404);
        }

        if (interview.recruiterId.toString() !== recruiterId) {
            throw new CustomError("Unauthorized action", 403);
        }
       

        const allowedStatuses: InterviewStatus[] = [
            INTERVIEW_STATUS.COMPLETED,
            INTERVIEW_STATUS.CANCELLED,
            INTERVIEW_STATUS.IN_PROGRESS
        ];

        if (!allowedStatuses.includes(status)) {
            throw new CustomError("Invalid status update", 400);
        }



        // COMPLETED means round completed, interview may still continue
        const isRoundCompleted = status === INTERVIEW_STATUS.COMPLETED;

        const updatedStatus: InterviewStatus = isRoundCompleted
            ? INTERVIEW_STATUS.IN_PROGRESS
            : status;

        const updatedInterview = await interviewRepository.updateByIdAndPopulate(
            interviewId,
            {
                updateData: {
                    status: updatedStatus,
                    $push: {
                        statusHistory: {
                            roundNumber,
                            status,
                            changedBy: recruiterId,
                            changedAt: new Date(),
                            note,
                        },
                    },
                },
                populate: [
                    { path: "candidateId", select: "name email" },
                    { path: "jobId", select: "title company" },
                ],
            }
        );




        if (!updatedInterview) {
            throw new CustomError("Interview not found after update", 404);
        }

        const populatedInterview =
            updatedInterview as unknown as InterviewPopulated;

        try {
            await sendInterviewEmail(status, {
                to: populatedInterview.candidateId.email,
                candidateName: populatedInterview.candidateId.name,
                jobTitle: populatedInterview.jobId.title,
                companyName: populatedInterview.jobId.company,
                reason: note,
            });
        } catch (err) {
            console.error("Interview email failed:", err);

        }


        return populatedInterview;
    };


    const candidateGetInterviews = async ({ candidateId }: { candidateId: string }) => {
        if (!candidateId) {
            throw new CustomError("Candidate ID is missing", 400);
        }

        const interviews = interviewRepository.findMany({ filter: { candidateId }, populate: { path: "jobId", select: "company title" } })
        return interviews
    }

    return {
        recruiterGetInterviews,
        recruiterGetInterviewById,
        recruiterScheduleInterview,
        recruiterUpdateInterviewStatus,
        candidateGetInterviews
    }
}