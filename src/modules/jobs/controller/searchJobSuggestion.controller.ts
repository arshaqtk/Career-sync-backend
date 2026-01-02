import { Request,Response } from "express"
import { getJobSuggestionservice } from "../services/getJobSearchSuggestion.service"

export const getJobSuggestionController=async(req:Request,res:Response)=>{
    const rawQuery = req.query.query
console.log(rawQuery)
  if (typeof rawQuery !== "string" || rawQuery.length < 2) {
    return res.json([])
  }
const search=rawQuery
    const jobSuggestion=await getJobSuggestionservice({search})

    res.status(200).json({
      success: true,
      data: jobSuggestion,
    });
}