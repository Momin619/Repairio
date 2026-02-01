import express from "express";
import { protect } from "../middlewares/auth.js";

const authRouter = express.Router();

// auth.js
authRouter.get("/me", protect, async (req, res) => {
  try {
    if (req.role === "seller" && req.user) {
      console.log("req.user:", req.user);
      console.log("req.user.subscription:", req.user.subscription);

      // Convert subscription to plain object
      const subscription = req.user.subscription
        ? {
            _id: req.user.subscription._id,
            startDate: req.user.subscription.startDate,
            endDate: req.user.subscription.endDate,
            status: req.user.subscription.status,
          }
        : null;

      return res.json({
        role: "seller",
        userId: req.user._id,
        isLoggedIn: true,
        subscription,
      });
    }

    if (req.role === "admin" && req.admin) {
      return res.json({
        role: "admin",
        userId: req.admin._id,
        isLoggedIn: true,
      });
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
