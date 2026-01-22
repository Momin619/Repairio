import express from "express";

import { login, signup } from "../controller/user.js";

import { checkSubscription } from "../controller/adminUserManagment.js";

import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.get("/dashboard", protect, checkSubscription);

console.log("User routes loaded");

export default userRouter;
