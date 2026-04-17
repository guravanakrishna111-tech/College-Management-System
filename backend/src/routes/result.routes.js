import { Router } from "express";
import { ROLES } from "../constants/roles.js";
import {
  deleteResult,
  exportResults,
  getResultRankings,
  getStudentResults,
  listResults,
  uploadBulkResults,
  uploadResult
} from "../controllers/result.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/me", authorize(ROLES.STUDENT), getStudentResults);
router.get("/rankings", getResultRankings);
router.get("/export/csv", authorize(ROLES.ADMIN), exportResults);
router.get("/student/:studentId", getStudentResults);
router.get("/", listResults);
router.post("/", authorize(ROLES.ADMIN), uploadResult);
router.post("/bulk", authorize(ROLES.ADMIN), uploadBulkResults);
router.delete("/:id", authorize(ROLES.ADMIN), deleteResult);

export default router;
