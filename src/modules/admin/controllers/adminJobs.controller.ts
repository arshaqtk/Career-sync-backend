import { Request, Response } from "express"
import { adminJobListService, blockJobByAdminService, getAdminJobDetailService, unblockJobByAdminService } from "../services/adminJobs.service"
import { CustomError } from "../../../shared/utils/customError"

export const adminGetJobs = async (req: Request, res: Response) => {
  const {
    search,
    limit = "10",
    page = "1",
    status = "all",
  } = req.query

  const result = await adminJobListService({
    page: Number(page),
    limit: Number(limit),
    search: search as string | undefined,
    status: status as "active" | "blocked" | "closed" | "all",
  })

  return res.status(200).json({
    success: true,
    data: {
      jobs: result.jobs,
      pagination: result.pagination,
    },
  })
}

export const adminGetJobDetail = async (req: Request, res: Response) => {
  const { id } = req.params

  const job = await getAdminJobDetailService(id)

  res.status(200).json({
    success: true,
    data: job,
  })
}


export const adminBlockJob = async (req: Request, res: Response) => {
  const adminId=req.user?.id
  const { id: jobId } = req.params
  const { reason } = req.body
  if(!adminId){
    throw new CustomError("SomeThing went wrong....")
  }

  await blockJobByAdminService({
    jobId,
    reason,
    adminId
  })

  return res.status(200).json({
    success: true,
    message: "Job blocked successfully",
  })
}

export const adminUnblockJob = async (req: Request, res: Response) => {
  const { id: jobId } = req.params
const adminId=req.user?.id

if(!adminId){
    throw new CustomError("SomeThing went wrong....")
  }
  await unblockJobByAdminService({ jobId,adminId})

  return res.status(200).json({
    success: true,
    message: "Job unblocked successfully",
  })
}