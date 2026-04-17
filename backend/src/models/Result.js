import mongoose from "mongoose";
import { GRADE_VALUES } from "../constants/grades.js";

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    examType: {
      type: String,
      enum: ["MID_SEM", "END_SEM", "QUIZ", "PRACTICAL"],
      required: true
    },
    marks: {
      internal: {
        type: Number,
        default: 0
      },
      external: {
        type: Number,
        default: 0
      },
      practical: {
        type: Number,
        default: 0
      }
    },
    totalMarks: {
      type: Number,
      required: true
    },
    maxMarks: {
      type: Number,
      default: 100
    },
    credits: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    grade: {
      type: String,
      enum: GRADE_VALUES,
      required: true
    },
    gradePoint: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["PASS", "FAIL"],
      required: true
    }
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, semester: 1 });
resultSchema.index({ courseId: 1 });
resultSchema.index({ examId: 1 });
resultSchema.index({ departmentId: 1, semester: 1 });
resultSchema.index({ studentId: 1, courseId: 1, examId: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;
