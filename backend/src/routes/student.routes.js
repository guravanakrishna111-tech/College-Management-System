import { Router } from "express";
import { ROLES } from "../constants/roles.js";
import {
  createStudent,
  deleteStudent,
  getMyProfile,
  getStudentById,
  getStudents,
  updateStudent
} from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/me", authorize(ROLES.STUDENT), getMyProfile);
router.get("/", authorize(ROLES.ADMIN), getStudents);
router.post("/", authorize(ROLES.ADMIN), createStudent);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.STUDENT), getStudentById);
router.put("/:id", authorize(ROLES.ADMIN), updateStudent);
router.delete("/:id", authorize(ROLES.ADMIN), deleteStudent);

export default router;
