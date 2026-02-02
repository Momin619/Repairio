import express from "express";

import { login, signup } from "../controller/user.js";

import { logout } from "../utils/logout.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.post("/logout", logout);

export default userRouter;
