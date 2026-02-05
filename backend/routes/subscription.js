import express from "express";
import { protect } from "../middlewares/auth.js";
import { expireSubscription } from "../controller/subscription.js";
const subscriptionRouter = express.Router();

subscriptionRouter.post("/subscription/expire", protect, expireSubscription);

export default subscriptionRouter;
