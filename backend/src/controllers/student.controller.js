import { ApiError, asyncHandler } from "../middleware/error.middleware.js";
import Student from "../models/Student.js";
import { buildCaseInsensitiveRegex, parsePagination } from "../utils/validators.js";
import { validateStudentPayload } from "../validations/student.validation.js";

export const getStudents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filters = {};

  ["departmentId", "year", "semester", "section"].forEach((key) => {
    if (req.query[key]) {
      filters[key] = req.query[key];
    }
  });

  if (req.query.search) {
    const regex = buildCaseInsensitiveRegex(req.query.search);
    filters.$or = [{ name: regex }, { studentId: regex }, { rollNumber: regex }];
  }

  const [items, total] = await Promise.all([
    Student.find(filters)
      .sort({ year: 1, semester: 1, rollNumber: 1 })
      .skip(skip)
      .limit(limit)
      .populate("departmentId", "name code"),
    Student.countDocuments(filters)
  ]);

  res.json({
    success: true,
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  });
});

export const createStudent = asyncHandler(async (req, res) => {
  validateStudentPayload(req.body);
  const item = await Student.create(req.body);
  res.status(201).json({ success: true, item });
});

export const getStudentById = asyncHandler(async (req, res) => {
  const item = await Student.findById(req.params.id).populate("departmentId", "name code");

  if (!item) {
    throw new ApiError(404, "Student not found");
  }

  if (req.user.role === "STUDENT" && String(req.user.studentProfile?._id) !== String(item._id)) {
    throw new ApiError(403, "You can only access your own profile");
  }

  res.json({ success: true, item });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  if (!req.user.studentProfile) {
    throw new ApiError(404, "Student profile is not linked to this account");
  }

  const item = await Student.findById(req.user.studentProfile._id).populate("departmentId", "name code");
  res.json({ success: true, item });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const item = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("departmentId", "name code");

  if (!item) {
    throw new ApiError(404, "Student not found");
  }

  res.json({ success: true, item });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const item = await Student.findByIdAndDelete(req.params.id);

  if (!item) {
    throw new ApiError(404, "Student not found");
  }

  res.json({ success: true, message: "Student deleted successfully" });
});
