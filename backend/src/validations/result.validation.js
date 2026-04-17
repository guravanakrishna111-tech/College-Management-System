import { ApiError } from "../middleware/error.middleware.js";
import { assertRequiredFields } from "../utils/validators.js";

export const validateResultPayload = (payload) => {
  assertRequiredFields(payload, [
    "studentId",
    "courseId",
    "examId",
    "semester",
    "academicYear"
  ]);

  if (!payload.marks || typeof payload.marks !== "object") {
    throw new ApiError(400, "marks object is required");
  }
};
