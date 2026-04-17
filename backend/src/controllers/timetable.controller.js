import { ApiError, asyncHandler } from "../middleware/error.middleware.js";
import {
  createTimetableEntry,
  deleteTimetableEntry,
  getTimetableDashboard,
  getTimetableEntries,
  updateTimetableEntry
} from "../services/timetable.service.js";
import { validateTimetablePayload } from "../validations/timetable.validation.js";

export const listTimetables = asyncHandler(async (req, res) => {
  const data = await getTimetableEntries(req.query);
  res.json({ success: true, ...data });
});

export const createTimetable = asyncHandler(async (req, res) => {
  validateTimetablePayload(req.body);
  const item = await createTimetableEntry(req.body);
  res.status(201).json({ success: true, item });
});

export const updateTimetable = asyncHandler(async (req, res) => {
  const item = await updateTimetableEntry(req.params.id, req.body);

  if (!item) {
    throw new ApiError(404, "Timetable entry not found");
  }

  res.json({ success: true, item });
});

export const removeTimetable = asyncHandler(async (req, res) => {
  const item = await deleteTimetableEntry(req.params.id);

  if (!item) {
    throw new ApiError(404, "Timetable entry not found");
  }

  res.json({ success: true, message: "Timetable entry deleted successfully" });
});

export const getTimetableAnalytics = asyncHandler(async (req, res) => {
  const items = await getTimetableDashboard();
  res.json({ success: true, items });
});
