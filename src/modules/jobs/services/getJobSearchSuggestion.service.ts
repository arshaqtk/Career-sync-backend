import { jobRepository } from "../repository/job.repository";


export const getJobSuggestionservice=async({search}:{search:string})=>{
    let filter:any={}
    if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

     const suggestions = await jobRepository.findByQuery(filter).select("title")
    .limit(6)

     return suggestions.map((job) => job.title)
} 