import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import repairItemRouter from "./routes/repairItem.js";
import subscriptionRouter from "./routes/subscription.js";
import authRouter from "./routes/auth.js";
import connectDB from "./utils/connectMongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.100.7:5173",
  process.env.FRONTEND_URL, // MUST be https://www.repairio.online
];

// 1️⃣ CORS middleware first
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2️⃣ Preflight OPTIONS requests

// 3️⃣ Body parser & cookie parser
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("---- Incoming Request ----");
  console.log("Origin:", req.headers.origin);
  console.log("Raw Cookie Header:", req.headers.cookie);
  console.log("Parsed Cookies:", req.cookies);
  console.log("--------------------------");
  next();
});
// 4️⃣ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api", repairItemRouter);
app.use("/api", subscriptionRouter);

// 5️⃣ Error handler for blocked CORS (optional, helpful for logs)
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked this request" });
  }
  next(err);
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
