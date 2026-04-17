import { Router } from "express";
import {
  getBestClasses,
  getDepartmentAnalytics,
  getOverview,
  getSubjectPerformance,
  getTopStudents
} from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/overview", getOverview);
router.get("/top-students", getTopStudents);
router.get("/best-classes", getBestClasses);
router.get("/subject-performance", getSubjectPerformance);
router.get("/department-comparison", getDepartmentAnalytics);

export default router;
