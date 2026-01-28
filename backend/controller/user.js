import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// User Signup

export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({
      message: "Account created. Waiting for admin approval.",
      userId: user._id,
    });
  } catch (err) {
    // Handle duplicate email
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(400).json({
        message: "This email is already registered. Please use another email.",
      });
    }

    res.status(400).json({
      message: "Error creating account from backend",
      error: err.message,
    });
  }
};

// User Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate subscription for seller
    const user = await User.findOne({ email }).populate("subscription");
    if (!user)
      return res
        .status(401)
        .json({ code: "INVALID", message: "Invalid credentials" });

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ code: "INVALID", message: "Invalid credentials" });

    // Check if account is active
    if (!user.isActive)
      return res
        .status(403)
        .json({ code: "INACTIVE", message: "Account not active" });

    // Seller: check subscription
    let subscriptionStatus = null;
    let subscriptionEndDate = null;

    if (user.role === "seller") {
      const now = new Date();
      if (
        !user.subscription ||
        user.subscription.status !== "active" ||
        new Date(user.subscription.endDate) < now
      ) {
        return res
          .status(403)
          .json({ code: "EXPIRED", message: "Subscription expired" });
      }
      subscriptionStatus = user.subscription.status;
      subscriptionEndDate = user.subscription.endDate;
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with token and user info
    res.json({
      role: user.role,
      userId: user._id,
      isLoggedIn: true,
      subscriptionStatus,
      subscriptionEndDate,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
