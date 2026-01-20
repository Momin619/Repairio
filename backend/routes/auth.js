import express from "express";

import { login, signup } from "../controller/user.js";

import { checkSubscription } from "../controller/adminUserManagment.js";

import { protect } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.get("/dashboard", protect, checkSubscription);

export default authRouter;
