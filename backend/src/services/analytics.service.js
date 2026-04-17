import Department from "../models/Department.js";
import Event from "../models/Event.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Timetable from "../models/Timetable.js";
import { ensureObjectId } from "../utils/validators.js";
import { getRankings } from "./result.service.js";

export const getOverviewAnalytics = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [students, departments, exams, timetableEntries, events, averagePerformance] = await Promise.all([
    Student.countDocuments(),
    Department.countDocuments(),
    Exam.countDocuments({ date: { $gte: now } }),
    Timetable.countDocuments(),
    Event.countDocuments({ startDate: { $gte: startOfMonth, $lte: endOfMonth } }),
    Result.aggregate([
      {
        $group: {
          _id: null,
          averageMarks: { $avg: "$percentage" },
          averageGpa: { $avg: "$gradePoint" }
        }
      }
    ])
  ]);

  return {
    cards: [
      { label: "Students", value: students },
      { label: "Departments", value: departments },
      { label: "Upcoming Exams", value: exams },
      { label: "Timetable Entries", value: timetableEntries },
      { label: "Month Events", value: events },
      { label: "Average GPA", value: Number((averagePerformance[0]?.averageGpa || 0).toFixed(2)) }
    ]
  };
};

export const getBestClassesAnalytics = async () =>
  Result.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
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
      $group: {
        _id: {
          department: "$department.code",
          year: "$student.year",
          semester: "$student.semester",
          section: "$student.section"
        },
        averageMarks: { $avg: "$percentage" },
        totalStudents: { $addToSet: "$studentId" }
      }
    },
    {
      $project: {
        _id: 0,
        classLabel: {
          $concat: [
            "$_id.department",
            " - Year ",
            { $toString: "$_id.year" },
            " / Sem ",
            { $toString: "$_id.semester" },
            " / Sec ",
            "$_id.section"
          ]
        },
        averageMarks: { $round: ["$averageMarks", 2] },
        studentCount: { $size: "$totalStudents" }
      }
    },
    { $sort: { averageMarks: -1 } },
    { $limit: 10 }
  ]);

export const getSubjectWisePerformance = async ({ departmentId, semester } = {}) => {
  const match = {};
  if (departmentId) {
    match.departmentId = ensureObjectId(departmentId, "departmentId");
  }
  if (semester) {
    match.semester = Number(semester);
  }

  return Result.aggregate([
    ...(Object.keys(match).length ? [{ $match: match }] : []),
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
        _id: "$courseId",
        courseCode: { $first: "$course.code" },
        courseName: { $first: "$course.name" },
        averageMarks: { $avg: "$percentage" },
        passCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "PASS"] }, 1, 0]
          }
        },
        totalCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        courseCode: 1,
        courseName: 1,
        averageMarks: { $round: ["$averageMarks", 2] },
        passRate: {
          $round: [{ $multiply: [{ $divide: ["$passCount", "$totalCount"] }, 100] }, 2]
        }
      }
    },
    { $sort: { averageMarks: -1 } }
  ]);
};

export const getDepartmentComparison = async () =>
  Result.aggregate([
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "department"
      }
    },
    { $unwind: "$department" },
    {
      $group: {
        _id: "$department.code",
        averageMarks: { $avg: "$percentage" },
        averageGradePoint: { $avg: "$gradePoint" },
        totalResults: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        department: "$_id",
        averageMarks: { $round: ["$averageMarks", 2] },
        averageGradePoint: { $round: ["$averageGradePoint", 2] },
        totalResults: 1
      }
    },
    { $sort: { averageMarks: -1 } }
  ]);

export const getTopStudentsAnalytics = (params) => getRankings(params);
