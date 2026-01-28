import express from "express";
import { adminSignup, adminLogin, getUser } from "../controller/admin.js";

import {
  listUsers,
  createSubscription,
  updateSubscription,
} from "../controller/adminUserManagment.js";
import { protect, isAdmin } from "../middlewares/auth.js";
import { logout } from "../utils/logout.js";
const adminRouter = express.Router();

// Admin auth
adminRouter.post("/signup", adminSignup); // optional
adminRouter.post("/login", adminLogin);

// Admin dashboard routes (protected)
adminRouter.get("/users", protect, isAdmin, listUsers); // list all sellers
adminRouter.post(
  "/create-subscription/:userId",
  protect,
  isAdmin,
  createSubscription,
); // approve & activate

adminRouter.post(
  "/update-subscription/:userId",
  protect,
  isAdmin,
  updateSubscription,
);
adminRouter.get("/user/:userId", protect, isAdmin, getUser);
adminRouter.post("/logout", logout);
export default adminRouter;
