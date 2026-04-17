import mongoose from "mongoose";
import { ApiError } from "../middleware/error.middleware.js";

export const assertRequiredFields = (payload, fields) => {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
  }
};

export const ensureObjectId = (value, label = "id") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${label}`);
  }

  return new mongoose.Types.ObjectId(value);
};

export const parsePagination = (query = {}) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

export const buildCaseInsensitiveRegex = (value) => {
  if (!value) {
    return undefined;
  }

  return new RegExp(String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
};

export const toNumberOrDefault = (value, defaultValue = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};
