import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { createJobSchema } from "../validators/createJob.schema";
import { addJobController } from "../controller/addJob.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { getAllJobs } from "../controller/getAllJobs.controller";

const router = Router();

router.get("/jobs",authMiddleware, getAllJobs);
router.post("/add-job",authMiddleware,validate(createJobSchema), addJobController);


export default router;