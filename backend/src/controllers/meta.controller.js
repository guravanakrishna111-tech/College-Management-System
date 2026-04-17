import { asyncHandler } from "../middleware/error.middleware.js";
import Course from "../models/Course.js";
import Department from "../models/Department.js";
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";

export const getBootstrapMeta = asyncHandler(async (req, res) => {
  const [departments, faculty, courses, students] = await Promise.all([
    Department.find().sort({ code: 1 }),
    Faculty.find().sort({ name: 1 }).populate("departmentId", "name code"),
    Course.find().sort({ code: 1 }).populate("departmentId", "name code"),
    Student.find()
      .sort({ rollNumber: 1 })
      .select("name studentId rollNumber year semester section departmentId")
      .populate("departmentId", "name code")
  ]);

  res.json({
    success: true,
    departments,
    faculty,
    courses,
    students
  });
});
