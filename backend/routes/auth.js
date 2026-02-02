import express from "express";
import { protect } from "../middlewares/auth.js";
import { checkSubscriptionExpiry } from "../utils/subscription.js";

const authRouter = express.Router();

// GET CURRENT AUTH USER
authRouter.get("/me", protect, async (req, res) => {
  try {
    // ---------- SELLER ----------
    if (req.role === "seller" && req.user) {
      let subscription = req.user.subscription || null;

      // 🔑 Always check expiry on backend (server time)
      if (subscription) {
        subscription = await checkSubscriptionExpiry(subscription);
      }

      return res.json({
        role: "seller",
        userId: req.user._id,
        isLoggedIn: true,
        subscription: subscription
          ? {
              _id: subscription._id,
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              status: subscription.status,
            }
          : null,
      });
    }

    // ---------- ADMIN ----------
    if (req.role === "admin" && req.admin) {
      return res.json({
        role: "admin",
        userId: req.admin._id,
        isLoggedIn: true,
      });
    }

    // ---------- FALLBACK ----------
    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    console.error("[/auth/me] Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
