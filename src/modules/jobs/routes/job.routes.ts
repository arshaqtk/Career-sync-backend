import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { createJobSchema } from "../validators/createJob.schema";
import { addJobController } from "../controller/addJob.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { CandidategetJobs } from "../controller/getAllJobs.controller";
import { getRecruiterJobController } from "../controller/getRecruiterJobs.controller";
import { getJobByIdController } from "../controller/getJobById.controller";
import { updateJobController } from "../controller/updateJob.controller";
import { updateJobSchema } from "../validators/updateJob.schema";
import { deleteJobCOntroller } from "../controller/deleteJob.controller";
import { updateJobStatusSchema } from "../validators/updateJobStatus.schema";
import { updateJobStatusController } from "../controller/changeJobStatus.controller";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { ensureUserIsActive } from "../../../middlewares/ensureUserIsActive.middleware";
import { getJobSuggestionController } from "../controller/searchJobSuggestion.controller";

const router = Router();
router.use(authMiddleware)
router.use(ensureUserIsActive)

// Public / user routes
router.get("/jobs", CandidategetJobs);
router.get("/jobs/suggestions", getJobSuggestionController);
router.get("/jobs/:id", getJobByIdController);


// Employer job CRUD
router.post("/employer/jobs",authorizeRoles("recruiter"), validate(createJobSchema), addJobController);
router.put( "/employer/jobs/:id",authorizeRoles("recruiter"),validate(updateJobSchema),updateJobController);
router.patch( "/employer/jobs/:id/status",authorizeRoles("recruiter"),validate(updateJobStatusSchema),updateJobStatusController);
router.get("/employer/jobs",authorizeRoles("recruiter"),getRecruiterJobController);
router.delete("/employer/jobs/:id",authorizeRoles("recruiter"),deleteJobCOntroller);


export default router;
