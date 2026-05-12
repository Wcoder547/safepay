import { Router } from "express";
import {
  getBalance,
  topUp,
  sendMoney,
  getHistory,
  getWalletLogs,
  getStats,
  getRecentContacts,
  lookupUser,
} from "../controllers/wallet.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate); 
router.get("/balance",  getBalance);
router.post("/topup",   topUp);
router.post("/send",    sendMoney);
router.get("/history",  getHistory);
router.get("/logs",     getWalletLogs);
router.get("/stats", getStats);
router.get("/recent-contacts",  getRecentContacts);  
router.get("/lookup", lookupUser);


export default router;