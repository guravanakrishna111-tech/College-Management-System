import { Router } from "express";
import { ROLES } from "../constants/roles.js";
import {
  createTimetable,
  getTimetableAnalytics,
  listTimetables,
  removeTimetable,
  updateTimetable
} from "../controllers/timetable.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", listTimetables);
router.get("/summary", authorize(ROLES.ADMIN), getTimetableAnalytics);
router.post("/", authorize(ROLES.ADMIN), createTimetable);
router.put("/:id", authorize(ROLES.ADMIN), updateTimetable);
router.delete("/:id", authorize(ROLES.ADMIN), removeTimetable);

export default router;
