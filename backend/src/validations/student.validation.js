import { assertRequiredFields } from "../utils/validators.js";

export const validateStudentPayload = (payload) => {
  assertRequiredFields(payload, [
    "studentId",
    "rollNumber",
    "name",
    "email",
    "departmentId",
    "year",
    "semester",
    "section",
    "batchYear"
  ]);
};
