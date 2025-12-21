import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { createJobSchema } from "../validators/createJob.schema";
import { addJobController } from "../controller/addJob.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { CandidategetJobs } from "../controller/getAllJobs.controller";
import { getEmployerJobController } from "../controller/getEmployerJobs.controller";
import { getJobByIdController } from "../controller/getJobById.controller";
import { updateJobController } from "../controller/updateJob.controller";
import { updateJobSchema } from "../validators/updateJob.schema";
import { deleteJobCOntroller } from "../controller/deleteJob.controller";
import { updateJobStatusSchema } from "../validators/updateJobStatus.schema";
import { updateJobStatusController } from "../controller/changeJobStatus.controller";
import { authorizeRoles } from "../../../middlewares/role.middleware";

const router = Router();

// Public / user routes
router.get("/jobs",authMiddleware, CandidategetJobs);
router.get("/jobs/:id", authMiddleware, getJobByIdController);


// Employer job CRUD
router.post("/employer/jobs",authMiddleware,authorizeRoles("recruiter"), validate(createJobSchema), addJobController);
router.put( "/employer/jobs/:id",authMiddleware,authorizeRoles("recruiter"),validate(updateJobSchema),updateJobController);
router.patch( "/employer/jobs/:id/status",authMiddleware,authorizeRoles("recruiter"),validate(updateJobStatusSchema),updateJobStatusController);
router.get("/employer/jobs",authMiddleware,authorizeRoles("recruiter"),getEmployerJobController);
router.delete("/employer/jobs/:id",authMiddleware,authorizeRoles("recruiter"),deleteJobCOntroller);


export default router;
