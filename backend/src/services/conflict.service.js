import Exam from "../models/Exam.js";
import Timetable from "../models/Timetable.js";
import { ApiError } from "../middleware/error.middleware.js";

const overlapExpr = (startTime, endTime) => ({
  $and: [{ $lt: ["$startTime", endTime] }, { $gt: ["$endTime", startTime] }]
});

export const ensureClassScheduleConflictFree = async (payload, currentId = null) => {
  const baseQuery = { dayOfWeek: payload.dayOfWeek };

  if (currentId) {
    baseQuery._id = { $ne: currentId };
  }

  const [roomConflict, facultyConflict, sectionConflict] = await Promise.all([
    Timetable.findOne({
      ...baseQuery,
      room: payload.room,
      $expr: overlapExpr(payload.startTime, payload.endTime)
    }),
    Timetable.findOne({
      ...baseQuery,
      facultyId: payload.facultyId,
      $expr: overlapExpr(payload.startTime, payload.endTime)
    }),
    Timetable.findOne({
      ...baseQuery,
      departmentId: payload.departmentId,
      year: payload.year,
      semester: payload.semester,
      section: payload.section,
      period: payload.period
    })
  ]);

  if (roomConflict) {
    throw new ApiError(409, "Room is already allocated for the selected time slot");
  }

  if (facultyConflict) {
    throw new ApiError(409, "Faculty has another class during the selected time slot");
  }

  if (sectionConflict) {
    throw new ApiError(409, "The class section already has a scheduled entry for this period");
  }
};

export const ensureExamConflictFree = async (payload, currentId = null) => {
  const baseQuery = { date: new Date(payload.date) };

  if (currentId) {
    baseQuery._id = { $ne: currentId };
  }

  const [roomConflict, facultyConflict, studentConflict] = await Promise.all([
    Exam.findOne({
      ...baseQuery,
      room: payload.room,
      $expr: overlapExpr(payload.startTime, payload.endTime)
    }),
    payload.facultyId
      ? Exam.findOne({
          ...baseQuery,
          facultyId: payload.facultyId,
          $expr: overlapExpr(payload.startTime, payload.endTime)
        })
      : null,
    Exam.findOne({
      ...baseQuery,
      departmentId: payload.departmentId,
      year: payload.year,
      semester: payload.semester,
      section: payload.section || "ALL",
      $expr: overlapExpr(payload.startTime, payload.endTime)
    })
  ]);

  if (roomConflict) {
    throw new ApiError(409, "Exam room conflict detected for the selected slot");
  }

  if (facultyConflict) {
    throw new ApiError(409, "Invigilating faculty is already assigned elsewhere");
  }

  if (studentConflict) {
    throw new ApiError(409, "Student exam overlap detected for the selected class");
  }
};
