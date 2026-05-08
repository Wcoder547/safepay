import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { sendOtp, verifyOtpHandler } from "../controllers/otp.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected
router.post("/send-otp", authenticate, sendOtp);
router.post("/verify-otp", authenticate, verifyOtpHandler);
router.post("/logout", authenticate, logout);

export default router;