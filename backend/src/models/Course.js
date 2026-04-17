import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    credits: {
      type: Number,
      required: true,
      min: 1
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    }
  },
  { timestamps: true }
);

courseSchema.index({ departmentId: 1, year: 1, semester: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;
