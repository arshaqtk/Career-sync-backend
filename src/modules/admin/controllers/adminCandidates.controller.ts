import { Request,Response } from "express"

import { getAdminCandidateDetailService, adminCandidateListService } from "../services/adminCandidates.service"

export const adminGetCandidates=async(req:Request,res:Response)=>{
    const {search,limit=10,page=1,status}=req.params
    const candidates=await adminCandidateListService({
        page: Number(page),
         limit: Number(limit),
         search,status:status as "active" | "blocked" | "all" })

         res.status(200).json({
      success: true,
      data:{candidates: candidates.candidates,
      pagination: candidates.pagination}
    });
}

export const getAdminCandidateDetailController = async (
  req: Request,
  res: Response
) => {
  const { candidateId } = req.params

  const candidate = await getAdminCandidateDetailService(candidateId)

  return res.status(200).json({
    success: true,
    data: candidate,
  })
}
