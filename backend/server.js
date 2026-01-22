import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import repairItemRouter from "./routes/repairItem.js";
import connectDB from "./utils/connectMongodb.js";
import cors from "cors";

import path from "path";
dotenv.config();
connectDB();
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.100.124:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api", repairItemRouter);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
