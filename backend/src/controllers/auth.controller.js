import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { ROLES } from "../constants/roles.js";
import { ApiError, asyncHandler } from "../middleware/error.middleware.js";
import Department from "../models/Department.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const buildAuthResponse = async (user) => {
  const populatedUser = await User.findById(user._id)
    .select("-password")
    .populate({
      path: "studentProfile",
      populate: { path: "departmentId", select: "name code" }
    });

  return {
    token: createToken(user),
    user: populatedUser
  };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = ROLES.STUDENT, adminCode, studentProfile } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email, and password are required");
  }

  if (await User.findOne({ email })) {
    throw new ApiError(409, "A user with this email already exists");
  }

  let resolvedRole = role;
  let createdStudent = null;

  if (role === ROLES.ADMIN && adminCode !== env.adminRegistrationCode) {
    throw new ApiError(403, "Invalid admin registration code");
  }

  if (role === ROLES.STUDENT) {
    if (!studentProfile?.studentId || !studentProfile?.departmentId || !studentProfile?.rollNumber) {
      throw new ApiError(400, "Student registration requires studentProfile details");
    }

    const department =
      (await Department.findOne({ code: String(studentProfile.departmentId).toUpperCase() })) ||
      (await Department.findById(studentProfile.departmentId));

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    createdStudent = await Student.create({
      ...studentProfile,
      departmentId: department._id,
      name,
      email
    });
    resolvedRole = ROLES.STUDENT;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: resolvedRole,
    studentProfile: createdStudent?._id
  });

  if (createdStudent) {
    createdStudent.userId = user._id;
    await createdStudent.save();
  }

  const response = await buildAuthResponse(user);
  res.status(201).json({ success: true, ...response });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  const user = await User.findOne({ email }).populate("studentProfile");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const response = await buildAuthResponse(user);
  res.json({ success: true, ...response });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
