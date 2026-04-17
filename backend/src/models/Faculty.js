import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    employeeId: {
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
    designation: {
      type: String,
      default: "Assistant Professor"
    }
  },
  { timestamps: true }
);

facultySchema.index({ departmentId: 1 });

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
