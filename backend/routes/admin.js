import express from "express";
import { activateSubscription } from "../controller/admin.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.post("/activate/:userId", protect, isAdmin, activateSubscription);

export default adminRouter;
