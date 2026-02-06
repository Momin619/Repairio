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

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.100.7:5173"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/admin", adminRouter);
app.use("/api", repairItemRouter);
app.use("/api", subscriptionRouter);
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
