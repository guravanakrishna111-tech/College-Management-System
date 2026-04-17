import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    eventType: {
      type: String,
      enum: ["EVENT", "HOLIDAY", "ACADEMIC"],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    venue: String,
    audience: {
      type: String,
      enum: ["ALL", "STUDENTS", "FACULTY", "ADMIN"],
      default: "ALL"
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    colorTag: {
      type: String,
      default: "#0f766e"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1, endDate: 1, eventType: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
