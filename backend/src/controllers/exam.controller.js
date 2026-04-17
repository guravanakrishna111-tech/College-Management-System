import { ApiError, asyncHandler } from "../middleware/error.middleware.js";
import Exam from "../models/Exam.js";
import { ensureExamConflictFree } from "../services/conflict.service.js";
import { parsePagination } from "../utils/validators.js";

const populateConfig = [
  { path: "courseId", select: "code name credits" },
  { path: "facultyId", select: "employeeId name" },
  { path: "departmentId", select: "name code" }
];

export const listExams = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filters = {};

  ["departmentId", "year", "semester", "section", "examType", "academicYear"].forEach((key) => {
    if (req.query[key]) {
      filters[key] = req.query[key];
    }
  });

  const [items, total] = await Promise.all([
    Exam.find(filters).sort({ date: 1, startTime: 1 }).skip(skip).limit(limit).populate(populateConfig),
    Exam.countDocuments(filters)
  ]);

  res.json({
    success: true,
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  });
});

export const createExam = asyncHandler(async (req, res) => {
  await ensureExamConflictFree(req.body);
  const item = await Exam.create(req.body);
  await item.populate(populateConfig);
  res.status(201).json({ success: true, item });
});

export const updateExam = asyncHandler(async (req, res) => {
  await ensureExamConflictFree(req.body, req.params.id);

  const item = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate(populateConfig);

  if (!item) {
    throw new ApiError(404, "Exam not found");
  }

  res.json({ success: true, item });
});

export const deleteExam = asyncHandler(async (req, res) => {
  const item = await Exam.findByIdAndDelete(req.params.id);

  if (!item) {
    throw new ApiError(404, "Exam not found");
  }

  res.json({ success: true, message: "Exam deleted successfully" });
});
