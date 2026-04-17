import { assertRequiredFields } from "../utils/validators.js";

export const validateTimetablePayload = (payload) => {
  assertRequiredFields(payload, [
    "courseId",
    "facultyId",
    "departmentId",
    "year",
    "semester",
    "section",
    "dayOfWeek",
    "period",
    "startTime",
    "endTime",
    "room"
  ]);
};
