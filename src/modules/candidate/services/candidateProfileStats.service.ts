import { ApplicationModel } from "../../../modules/applications/models/application.model"
import { InterviewModel } from "../../../modules/Interview/models/interview.model"
import UserModel from "../../../modules/user/models/user.model"
import { IExperience } from "../../../modules/user/types/user.schema"

export const getCandidateProfileStatsService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .select("candidateData.experience")

  const [totalApplications, totalInterviews, offersReceived] =
    await Promise.all([
      ApplicationModel.countDocuments({ candidateId: userId }),
      InterviewModel.countDocuments({
        candidateId: userId,
        status: "Completed",
      }),
      ApplicationModel.countDocuments({ 
        candidateId: userId,
        status: { $in: ["Selected", "Hired", "OfferAccepted"] },
      }),
    ])

  const yearsOfExperience = calculateExperienceYears(
    user?.candidateData?.experience || []
  )

  return {
    totalApplications,
    totalInterviews,
    offersReceived,
    yearsOfExperience,
  }
}


function calculateExperienceYears(experience:IExperience[]=[]) {
  let totalMonths = 0

  experience.forEach(exp => {
    const start = new Date(exp.startDate)
    const end = exp.endDate ? new Date(exp.endDate) : new Date()

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())

    totalMonths += Math.max(months, 0)
  })

  return Math.floor(totalMonths / 12)
}
