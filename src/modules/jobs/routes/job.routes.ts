import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { createJobSchema } from "../validators/createJob.schema";
import { addJobController } from "../controller/addJob.controller";
import { requireauthMiddleware} from "../../../middlewares/requireAuth.middleware";
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
import { optionAuthMiddleware } from "../../../middlewares/optionalAuth.middleware";
import { catchAsync } from "../../../middlewares/asyncHandler";

const router = Router(); 

// Public / user routes

router.get("/jobs",optionAuthMiddleware, catchAsync(CandidategetJobs));
router.get("/jobs/suggestions",optionAuthMiddleware, catchAsync(getJobSuggestionController));
router.get("/jobs/:id", optionAuthMiddleware,catchAsync(getJobByIdController));

router.use(requireauthMiddleware)
router.use(ensureUserIsActive)

// Employer job CRUD
router.post("/employer/jobs",authorizeRoles("recruiter"), validate(createJobSchema), addJobController);
router.put( "/employer/jobs/:id",authorizeRoles("recruiter"),validate(updateJobSchema),updateJobController);
router.patch( "/employer/jobs/:id/status",authorizeRoles("recruiter"),validate(updateJobStatusSchema),updateJobStatusController);
router.get("/employer/jobs",authorizeRoles("recruiter"),getRecruiterJobController);
router.delete("/employer/jobs/:id",authorizeRoles("recruiter"),deleteJobCOntroller);


export default router;
