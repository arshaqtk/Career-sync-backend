import { PipelineStage } from "mongoose";

export const buildJobStatsPipeline = (
  match: PipelineStage.Match["$match"] = {}
): PipelineStage[] => {
  return [
    { $match: match },
    {
      $facet: {
        jobsPosted: [{ $count: "count" }],
        activeJobs: [
          { $match: { status: "open" } },
          { $count: "count" },
        ],
      },
    },
  ];
};
