import Course from "../models/Course.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import { ApiError } from "../middleware/error.middleware.js";
import { calculateCgpa } from "../utils/cgpaCalculator.js";
import { calculateGradeMetrics } from "../utils/gradeCalculator.js";
import { calculateSgpa } from "../utils/sgpaCalculator.js";
import {
  buildCaseInsensitiveRegex,
  ensureObjectId,
  parsePagination,
  toNumberOrDefault
} from "../utils/validators.js";

const resultPopulate = [
  {
    path: "studentId",
    select: "studentId rollNumber name year semester section",
    populate: { path: "departmentId", select: "name code" }
  },
  { path: "courseId", select: "code name credits year semester" },
  { path: "examId", select: "examId examType academicYear date startTime endTime room" },
  { path: "departmentId", select: "name code" }
];

const normalizeResultPayload = async (payload) => {
  const [student, course, exam] = await Promise.all([
    Student.findById(payload.studentId),
    Course.findById(payload.courseId),
    Exam.findById(payload.examId)
  ]);

  if (!student || !course || !exam) {
    throw new ApiError(404, "Student, course, or exam was not found");
  }

  const metrics = calculateGradeMetrics({
    internalMarks: toNumberOrDefault(payload.marks?.internal, 0),
    externalMarks: toNumberOrDefault(payload.marks?.external, 0),
    practicalMarks: toNumberOrDefault(payload.marks?.practical, 0),
    maxMarks: toNumberOrDefault(payload.maxMarks, 100)
  });

  return {
    studentId: student._id,
    courseId: course._id,
    examId: exam._id,
    departmentId: student.departmentId,
    academicYear: payload.academicYear,
    semester: Number(payload.semester),
    examType: payload.examType || exam.examType,
    marks: {
      internal: toNumberOrDefault(payload.marks?.internal, 0),
      external: toNumberOrDefault(payload.marks?.external, 0),
      practical: toNumberOrDefault(payload.marks?.practical, 0)
    },
    totalMarks: metrics.totalMarks,
    maxMarks: toNumberOrDefault(payload.maxMarks, 100),
    credits: Number(payload.credits || course.credits),
    percentage: metrics.percentage,
    grade: metrics.grade,
    gradePoint: metrics.gradePoint,
    status: metrics.status
  };
};

export const upsertResult = async (payload) => {
  const normalized = await normalizeResultPayload(payload);

  return Result.findOneAndUpdate(
    {
      studentId: normalized.studentId,
      courseId: normalized.courseId,
      examId: normalized.examId
    },
    normalized,
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  ).populate(resultPopulate);
};

export const bulkUpsertResults = async (payloads = []) => {
  const saved = [];

  for (const payload of payloads) {
    saved.push(await upsertResult(payload));
  }

  return saved;
};

export const getResults = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {};

  ["studentId", "courseId", "examId", "departmentId", "semester", "examType", "academicYear"].forEach(
    (key) => {
      if (query[key]) {
        filters[key] = query[key];
      }
    }
  );

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    const regex = buildCaseInsensitiveRegex(query.search);
    const students = await Student.find({
      $or: [{ name: regex }, { rollNumber: regex }, { studentId: regex }]
    }).select("_id");
    filters.studentId = { $in: students.map((student) => student._id) };
  }

  const [items, total] = await Promise.all([
    Result.find(filters)
      .sort({ semester: 1, percentage: -1 })
      .skip(skip)
      .limit(limit)
      .populate(resultPopulate),
    Result.countDocuments(filters)
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  };
};

export const getStudentResultOverview = async (studentId) => {
  const objectId = ensureObjectId(studentId, "studentId");
  const student = await Student.findById(objectId).populate("departmentId", "name code");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const semesterSummaries = await Result.aggregate([
    { $match: { studentId: objectId } },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course"
      }
    },
    { $unwind: "$course" },
    {
      $group: {
        _id: { semester: "$semester", academicYear: "$academicYear" },
        totalCredits: { $sum: "$credits" },
        totalCreditPoints: { $sum: { $multiply: ["$credits", "$gradePoint"] } },
        averageMarks: { $avg: "$percentage" },
        subjects: {
          $push: {
            resultId: "$_id",
            courseCode: "$course.code",
            courseName: "$course.name",
            credits: "$credits",
            totalMarks: "$totalMarks",
            percentage: "$percentage",
            grade: "$grade",
            gradePoint: "$gradePoint",
            examType: "$examType",
            status: "$status"
          }
        }
      }
    },
    { $sort: { "_id.semester": 1 } }
  ]);

  const semesters = semesterSummaries.map((item) => ({
    semester: item._id.semester,
    academicYear: item._id.academicYear,
    totalCredits: item.totalCredits,
    totalCreditPoints: item.totalCreditPoints,
    sgpa: calculateSgpa(item.subjects),
    percentage: Number(item.averageMarks.toFixed(2)),
    subjects: item.subjects.sort((left, right) => left.courseCode.localeCompare(right.courseCode))
  }));

  return {
    student,
    semesters,
    cgpa: calculateCgpa(semesters),
    percentage:
      semesters.length === 0
        ? 0
        : Number(
            (semesters.reduce((sum, semester) => sum + semester.percentage, 0) / semesters.length).toFixed(2)
          )
  };
};

export const getRankings = async ({ departmentId, year, semester, limit = 10 } = {}) => {
  const pipeline = [
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    { $unwind: "$student" }
  ];

  const match = {};
  if (departmentId) {
    match.departmentId = ensureObjectId(departmentId, "departmentId");
  }
  if (semester) {
    match.semester = Number(semester);
  }
  if (year) {
    match["student.year"] = Number(year);
  }

  if (Object.keys(match).length) {
    pipeline.push({ $match: match });
  }

  pipeline.push(
    {
      $group: {
        _id: "$studentId",
        student: { $first: "$student" },
        averageMarks: { $avg: "$percentage" },
        totalCredits: { $sum: "$credits" },
        totalCreditPoints: { $sum: { $multiply: ["$credits", "$gradePoint"] } }
      }
    },
    {
      $lookup: {
        from: "departments",
        localField: "student.departmentId",
        foreignField: "_id",
        as: "department"
      }
    },
    { $unwind: "$department" },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        name: "$student.name",
        rollNumber: "$student.rollNumber",
        classLabel: {
          $concat: [
            { $toString: "$student.year" },
            " Year / Sem ",
            { $toString: "$student.semester" },
            " / Sec ",
            "$student.section"
          ]
        },
        department: "$department.code",
        averageMarks: { $round: ["$averageMarks", 2] },
        sgpa: { $round: [{ $divide: ["$totalCreditPoints", "$totalCredits"] }, 2] }
      }
    },
    { $sort: { sgpa: -1, averageMarks: -1, name: 1 } },
    { $limit: Number(limit) }
  );

  return Result.aggregate(pipeline);
};

export const exportResultsCsv = async (query = {}) => {
  const { items } = await getResults({ ...query, page: 1, limit: 1000 });
  const header = [
    "studentId",
    "studentName",
    "rollNumber",
    "courseCode",
    "courseName",
    "examType",
    "semester",
    "credits",
    "totalMarks",
    "percentage",
    "grade",
    "status"
  ];

  const rows = items.map((result) =>
    [
      result.studentId?.studentId,
      result.studentId?.name,
      result.studentId?.rollNumber,
      result.courseId?.code,
      result.courseId?.name,
      result.examType,
      result.semester,
      result.credits,
      result.totalMarks,
      result.percentage,
      result.grade,
      result.status
    ]
      .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
};

export const deleteResultById = async (id) => Result.findByIdAndDelete(id);
