import { Router } from "express";
import {
  getBalance,
  topUp,
  sendMoney,
  getHistory,
  getWalletLogs,
} from "../controllers/wallet.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate); 
router.get("/balance",  getBalance);
router.post("/topup",   topUp);
router.post("/send",    sendMoney);
router.get("/history",  getHistory);
router.get("/logs",     getWalletLogs);

export default router;