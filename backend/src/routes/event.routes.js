import { Router } from "express";
import { ROLES } from "../constants/roles.js";
import { createEvent, deleteEvent, listEvents, updateEvent } from "../controllers/event.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", listEvents);
router.post("/", authorize(ROLES.ADMIN), createEvent);
router.put("/:id", authorize(ROLES.ADMIN), updateEvent);
router.delete("/:id", authorize(ROLES.ADMIN), deleteEvent);

export default router;
