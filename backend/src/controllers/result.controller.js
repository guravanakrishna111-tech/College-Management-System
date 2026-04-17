import { ApiError, asyncHandler } from "../middleware/error.middleware.js";
import {
  bulkUpsertResults,
  deleteResultById,
  exportResultsCsv,
  getRankings,
  getResults,
  getStudentResultOverview,
  upsertResult
} from "../services/result.service.js";
import { validateResultPayload } from "../validations/result.validation.js";

export const listResults = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "STUDENT"
      ? { ...req.query, studentId: req.user.studentProfile?._id }
      : req.query;

  const data = await getResults(query);
  res.json({ success: true, ...data });
});

export const uploadResult = asyncHandler(async (req, res) => {
  validateResultPayload(req.body);
  const item = await upsertResult(req.body);
  res.status(201).json({ success: true, item });
});

export const uploadBulkResults = asyncHandler(async (req, res) => {
  const { results = [] } = req.body;
  if (!Array.isArray(results) || results.length === 0) {
    throw new ApiError(400, "results array is required");
  }

  results.forEach(validateResultPayload);
  const items = await bulkUpsertResults(results);
  res.status(201).json({ success: true, items, count: items.length });
});

export const getStudentResults = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId || req.user.studentProfile?._id || req.query.studentId;

  if (!studentId) {
    throw new ApiError(400, "studentId is required");
  }

  if (req.user.role === "STUDENT" && String(req.user.studentProfile?._id) !== String(studentId)) {
    throw new ApiError(403, "You can only access your own results");
  }

  const data = await getStudentResultOverview(studentId);
  res.json({ success: true, ...data });
});

export const getResultRankings = asyncHandler(async (req, res) => {
  const items = await getRankings(req.query);
  res.json({ success: true, items });
});

export const exportResults = asyncHandler(async (req, res) => {
  const csv = await exportResultsCsv(req.query);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="results-export.csv"');
  res.send(csv);
});

export const deleteResult = asyncHandler(async (req, res) => {
  const item = await deleteResultById(req.params.id);

  if (!item) {
    throw new ApiError(404, "Result not found");
  }

  res.json({ success: true, message: "Result deleted successfully" });
});
