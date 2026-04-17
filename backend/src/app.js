import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import examRoutes from "./routes/exam.routes.js";
import metaRoutes from "./routes/meta.routes.js";
import resultRoutes from "./routes/result.routes.js";
import studentRoutes from "./routes/student.routes.js";
import timetableRoutes from "./routes/timetable.routes.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "College Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
