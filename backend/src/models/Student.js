import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    section: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    batchYear: {
      type: Number,
      required: true
    },
    dateOfBirth: Date,
    phone: String,
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
studentSchema.index({ departmentId: 1, year: 1, semester: 1, section: 1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;
