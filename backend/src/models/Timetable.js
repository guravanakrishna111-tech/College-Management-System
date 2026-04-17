import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    entryType: {
      type: String,
      enum: ["CLASS", "LAB"],
      default: "CLASS"
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
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
      required: true,
      uppercase: true
    },
    dayOfWeek: {
      type: String,
      required: true
    },
    period: {
      type: Number,
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
    notes: String
  },
  { timestamps: true }
);

timetableSchema.index(
  { departmentId: 1, year: 1, semester: 1, section: 1, dayOfWeek: 1, period: 1 },
  { unique: true }
);
timetableSchema.index({ facultyId: 1, dayOfWeek: 1, startTime: 1, endTime: 1 });
timetableSchema.index({ room: 1, dayOfWeek: 1, startTime: 1, endTime: 1 });

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;
