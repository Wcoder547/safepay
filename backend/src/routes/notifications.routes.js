import { Router } from "express";
import {
  getNotifications,
  markOneRead,
  markAllRead,
} from "../controllers/notifications.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/",              getNotifications);
router.post("/read-all",     markAllRead);      
router.post("/:id/read",     markOneRead);

export default router;