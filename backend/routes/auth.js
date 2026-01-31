import express from "express";
import { protect } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.get("/me", protect, async (req, res) => {
  try {
    if (req.role === "admin" && req.admin) {
      return res.json({
        role: "admin",
        userId: req.admin._id,
        isLoggedIn: true,
      });
    } else if (req.role === "seller" && req.user) {
      return res.json({
        role: "seller",
        userId: req.user._id,
        isLoggedIn: true,
        subscription: req.user.subscription,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
