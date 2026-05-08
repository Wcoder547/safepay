import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import authRouter from "./routes/auth.routes.js"; 




const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); 
app.use(express.static("public"));                               
app.use(cookieParser());  

app.get("/", (req, res) => {
  res.send("Welcome to the Financial Management API");
});

// Session setup (replaces JWT/cookie auth from MongoDB projects)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // true in prod (HTTPS only)
//       httpOnly: true,                                // JS cannot access cookie
//       maxAge: 1000 * 60 * 60 * 24,                  // 1 day
//     },
//   })
// );

// healthcheck route
// app.use("/api/v1/health", healthRouter);

// // auth routes (register, login, logout)
// app.use("/api/v1/auth", authRouter);

// user routes
app.use("/api/v1/auth", authRouter);

// // wallet routes
// app.use("/api/v1/wallet", walletRouter);

// // transaction routes
// app.use("/api/v1/transactions", transactionRouter);

// // notification routes
// app.use("/api/v1/notifications", notificationRouter);

// // fraud routes (admin only)
// app.use("/api/v1/fraud", fraudRouter);

export { app };