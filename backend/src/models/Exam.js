import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    },
    year: {
      type: Number,
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    section: {
      type: String,
      default: "ALL",
      uppercase: true
    },
    examType: {
      type: String,
      enum: ["MID_SEM", "END_SEM", "QUIZ", "PRACTICAL"],
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    instructions: String
  },
  { timestamps: true }
);

examSchema.index({ courseId: 1, examType: 1, academicYear: 1 });
examSchema.index({ date: 1, room: 1, startTime: 1, endTime: 1 });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
