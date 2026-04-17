import { Router } from "express";
import { ROLES } from "../constants/roles.js";
import { createExam, deleteExam, listExams, updateExam } from "../controllers/exam.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", listExams);
router.post("/", authorize(ROLES.ADMIN), createExam);
router.put("/:id", authorize(ROLES.ADMIN), updateExam);
router.delete("/:id", authorize(ROLES.ADMIN), deleteExam);

export default router;
