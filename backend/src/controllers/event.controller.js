import { ApiError, asyncHandler } from "../middleware/error.middleware.js";
import Event from "../models/Event.js";
import { parsePagination } from "../utils/validators.js";

export const listEvents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filters = {};

  ["eventType", "departmentId", "audience"].forEach((key) => {
    if (req.query[key]) {
      filters[key] = req.query[key];
    }
  });

  if (req.query.month) {
    const monthStart = new Date(req.query.month);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    filters.startDate = { $gte: monthStart, $lt: monthEnd };
  }

  const [items, total] = await Promise.all([
    Event.find(filters)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate("departmentId", "name code"),
    Event.countDocuments(filters)
  ]);

  res.json({
    success: true,
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const item = await Event.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, item });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const item = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("departmentId", "name code");

  if (!item) {
    throw new ApiError(404, "Event not found");
  }

  res.json({ success: true, item });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const item = await Event.findByIdAndDelete(req.params.id);

  if (!item) {
    throw new ApiError(404, "Event not found");
  }

  res.json({ success: true, message: "Event deleted successfully" });
});
