import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import { ApiError, asyncHandler } from "./error.middleware.js";

const extractToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.replace("Bearer ", "").trim();
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(401, "Authentication token is required");
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select("-password").populate({
    path: "studentProfile",
    populate: { path: "departmentId", select: "name code" }
  });

  if (!user) {
    throw new ApiError(401, "User session is no longer valid");
  }

  req.user = user;
  next();
});
