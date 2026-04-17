import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/college_management_system",
  jwtSecret: process.env.JWT_SECRET || "replace-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminRegistrationCode:
    process.env.ADMIN_REGISTRATION_CODE || "college-admin-2026"
};

export default env;