import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import connectDB from "./utils/connectMongodb.js";
import cors from "cors";
dotenv.config();
connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
