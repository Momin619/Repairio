import express from "express";
import { adminSignup, adminLogin } from "../controller/admin.js";

import { listUsers, approveUser } from "../controller/adminUserManagment.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const adminRouter = express.Router();

// Admin auth
adminRouter.post("/signup", adminSignup); // optional
adminRouter.post("/login", adminLogin);

// Admin dashboard routes (protected)
adminRouter.get("/users", protect, isAdmin, listUsers); // list all sellers
adminRouter.post("/approve/:userId", protect, isAdmin, approveUser); // approve & activate

export default adminRouter;
