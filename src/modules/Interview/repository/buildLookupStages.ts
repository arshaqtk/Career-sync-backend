import type { PopulateOptions } from "mongoose";
import { REF_COLLECTION_MAP } from "./refCollectionMap";

export const buildLookupStages = (populate?: PopulateOptions[]) => {
  if (!populate || populate.length === 0) return [];

  return populate.flatMap((p) => {
    const path = p.path as string;
    const from = REF_COLLECTION_MAP[path];

    if (!from) {
      throw new Error(
        `[Aggregation Populate Error] No collection mapping for: ${path}`
      );
    }

    const projectStage =
      p.select
        ? [{
            $project: p.select.split(" ").reduce(
              (acc, key) => {
                acc[key] = 1;
                return acc;
              },
              { _id: 1 } as Record<string, 1>
            ),
          }]
        : [];

    return [
      {
        $lookup: {
          from,
          localField: path,
          foreignField: "_id",
          as: path,
          pipeline: projectStage,
        },
      },
      {
        $unwind: {
          path: `$${path}`,
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  });
};
