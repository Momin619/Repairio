import express from "express";

import { login, signup } from "../controller/user.js";

import { logout } from "../utils/logout.js";

import { checkSubscription } from "../controller/adminUserManagment.js";

import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.post("/logout", logout);

userRouter.get("/dashboard", protect, checkSubscription);

export default userRouter;
