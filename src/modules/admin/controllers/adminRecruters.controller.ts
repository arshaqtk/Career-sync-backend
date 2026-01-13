import { Request,Response } from "express"
import { adminRecruiterListService, blockRecruiterByAdminService, getAdminRecruiterDetailService, unblockRecruiterByAdminService } from "../services/adminRecruiters.service"

export const adminGetRecruiters=async(req:Request,res:Response)=>{
    const {search,limit=10,page=1,status}=req.query
    const recruiters=await adminRecruiterListService({
        page: Number(page),
         limit: Number(limit),
         search:search as string,status:status as "active" | "blocked" | "all" })

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
     const  recruiterId  = req.params.recruiterId as string


  const recruiter = await getAdminRecruiterDetailService(recruiterId)

  return res.status(200).json({
    success: true,
    data: recruiter,
  })
}

export const blockRecruiterByAdminController = async (
  req: Request,
  res: Response
) => {
        const  recruiterId  = req.params.recruiterId as string


  const { reason } = req.body

  await blockRecruiterByAdminService({
    recruiterId,
    reason,
  })

  return res.status(200).json({
    success: true,
    message: "Recruiter blocked successfully",
  })
}


export const unblockRecruiterByAdminController = async (
  req: Request,
  res: Response
) => {
    const  recruiterId  = req.params.recruiterId as string

 

  await unblockRecruiterByAdminService({
    recruiterId
  })

  return res.status(200).json({
    success: true,
    message: "Recruiter unblocked successfully",
  })
}
