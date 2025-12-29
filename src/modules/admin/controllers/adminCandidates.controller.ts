import { Request,Response } from "express"
import { getAdminCandidateDetailService, adminCandidateListService, blockCandidateByAdminService, unblockCandidateByAdminService } from "../services/adminCandidates.service"



export const adminGetCandidates=async(req:Request,res:Response)=>{
    const {search,limit=10,page=1,status}=req.query
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

export const blockCandidateByAdminController = async (
  req: Request,
  res: Response
) => {
  const { candidateId } = req.params
  const { reason } = req.body

  await blockCandidateByAdminService({
    candidateId,
    reason,
  })

  return res.status(200).json({
    success: true,
    message: "Candidate blocked successfully",
  })
}

export const unblockCandidateByAdminController = async (
  req: Request,
  res: Response
) => {
  const { candidateId } = req.params
 

  await unblockCandidateByAdminService({
    candidateId
  })

  return res.status(200).json({
    success: true,
    message: "Candidate unblocked successfully",
  })
}
