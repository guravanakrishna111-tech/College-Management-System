import { asyncHandler } from "../middleware/error.middleware.js";
import {
  getBestClassesAnalytics,
  getDepartmentComparison,
  getOverviewAnalytics,
  getSubjectWisePerformance,
  getTopStudentsAnalytics
} from "../services/analytics.service.js";

export const getOverview = asyncHandler(async (req, res) => {
  const data = await getOverviewAnalytics();
  res.json({ success: true, ...data });
});

export const getTopStudents = asyncHandler(async (req, res) => {
  const items = await getTopStudentsAnalytics(req.query);
  res.json({ success: true, items });
});

export const getBestClasses = asyncHandler(async (req, res) => {
  const items = await getBestClassesAnalytics();
  res.json({ success: true, items });
});

export const getSubjectPerformance = asyncHandler(async (req, res) => {
  const items = await getSubjectWisePerformance(req.query);
  res.json({ success: true, items });
});

export const getDepartmentAnalytics = asyncHandler(async (req, res) => {
  const items = await getDepartmentComparison();
  res.json({ success: true, items });
});
