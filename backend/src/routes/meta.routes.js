import { Router } from "express";
import { getBootstrapMeta } from "../controllers/meta.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/bootstrap", getBootstrapMeta);

export default router;
