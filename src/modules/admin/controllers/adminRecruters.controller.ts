import { Request,Response } from "express"

import { adminRecruiterListService, getAdminRecruiterDetailService } from "../services/adminRecruiters.service"

export const adminGetRecruiters=async(req:Request,res:Response)=>{
    const {search,limit=10,page=1,status}=req.params
    const recruiters=await adminRecruiterListService({
        page: Number(page),
         limit: Number(limit),
         search,status:status as "active" | "blocked" | "all" })

         res.status(200).json({
      success: true,
      recruiters: recruiters.recruiters,
      pagination: recruiters.pagination,
    });
}

export const getAdminRecruiterDetailController = async (
  req: Request,
  res: Response
) => {
  const { recruiterId } = req.params

  const recruiter = await getAdminRecruiterDetailService(recruiterId)

  return res.status(200).json({
    success: true,
    data: recruiter,
  })
}