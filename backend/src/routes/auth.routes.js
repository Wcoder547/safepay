import { Router } from "express";
import {
  register, login, refresh, logout, me , forgotPassword, resetPassword
} from "../controllers/auth.controller.js";
import { sendOtp, verifyOtpHandler } from "../controllers/otp.controller.js";
import { changePin, verifyPin } from "../controllers/pin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Public ──────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/forgot-password",  forgotPassword);   
router.post("/reset-password",   resetPassword);    

// ── Protected ───────────────────────────
router.get("/me", authenticate, me);
router.post("/logout", authenticate, logout);
router.post("/send-otp", authenticate, sendOtp);
router.post("/verify-otp", authenticate, verifyOtpHandler);

// ── PIN ─────────────────────────────────
router.post("/pin/change", authenticate, changePin);
router.post("/pin/verify", authenticate, verifyPin);

export default router;