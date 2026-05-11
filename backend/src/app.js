import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import authRouter from "./routes/auth.routes.js"; 
import walletRouter from "./routes/wallet.routes.js";
import healthRouter from "./routes/healthcheck.routes.js";
import transactionRouter from "./routes/transactions.routes.js";
import notificationRouter from "./routes/notifications.routes.js";
import fraudRouter from "./routes/fraud.routes.js";
import adminRouter from "./routes/admin.routes.js";




const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));                               
app.use(cookieParser());  

app.get("/", (req, res) => {
  res.send("Welcome to the Financial Management API");
});


app.use("/api/v1/health", healthRouter);



app.use("/api/v1/auth", authRouter);

app.use("/api/v1/wallet", walletRouter);


app.use("/api/v1/transactions", transactionRouter);


app.use("/api/v1/notifications", notificationRouter);


app.use("/api/v1/fraud", fraudRouter);


app.use("/api/v1/admin", adminRouter);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  });
});

export { app };