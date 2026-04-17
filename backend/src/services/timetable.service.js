import Timetable from "../models/Timetable.js";
import { parsePagination } from "../utils/validators.js";
import { ensureClassScheduleConflictFree } from "./conflict.service.js";

const populateConfig = [
  { path: "courseId", select: "code name credits" },
  { path: "facultyId", select: "employeeId name email" },
  { path: "departmentId", select: "name code" }
];

export const getTimetableEntries = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {};

  ["departmentId", "year", "semester", "section", "dayOfWeek", "entryType"].forEach((key) => {
    if (query[key]) {
      filters[key] = query[key];
    }
  });

  const [items, total] = await Promise.all([
    Timetable.find(filters)
      .sort({ dayOfWeek: 1, period: 1 })
      .skip(skip)
      .limit(limit)
      .populate(populateConfig),
    Timetable.countDocuments(filters)
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  };
};

export const createTimetableEntry = async (payload) => {
  await ensureClassScheduleConflictFree(payload);
  const entry = await Timetable.create(payload);
  return entry.populate(populateConfig);
};

export const updateTimetableEntry = async (id, payload) => {
  await ensureClassScheduleConflictFree(payload, id);

  return Timetable.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).populate(populateConfig);
};

export const deleteTimetableEntry = async (id) => Timetable.findByIdAndDelete(id);

export const getTimetableDashboard = async () =>
  Timetable.aggregate([
    {
      $group: {
        _id: {
          departmentId: "$departmentId",
          year: "$year",
          semester: "$semester"
        },
        totalEntries: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "departments",
        localField: "_id.departmentId",
        foreignField: "_id",
        as: "department"
      }
    },
    { $unwind: "$department" },
    {
      $project: {
        _id: 0,
        department: "$department.code",
        year: "$_id.year",
        semester: "$_id.semester",
        totalEntries: 1
      }
    },
    { $sort: { department: 1, year: 1, semester: 1 } }
  ]);
