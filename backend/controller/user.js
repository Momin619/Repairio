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

    const user = await User.findOne({ email }).populate("subscription");
    if (!user)
      return res
        .status(401)
        .json({ code: "INVALID", message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ code: "INVALID", message: "Invalid credentials" });

    if (!user.isActive)
      return res
        .status(403)
        .json({ code: "INACTIVE", message: "Account not active" });

    let subscription = null;

    // ✅ SELLER SUBSCRIPTION CHECK
    if (user.role === "seller") {
      if (!user.subscription) {
        return res
          .status(403)
          .json({ code: "NO_SUB", message: "No subscription" });
      }

      const now = new Date();
      const endDate = new Date(user.subscription.endDate);
      console.log("user", user);
      console.log("subscription", user.subscription);
      console.log("NOW:", new Date());
      console.log("END DATE:", new Date(user.subscription.endDate));
      console.log(
        "NOW >= END DATE?",
        new Date() >= new Date(user.subscription.endDate),
      );

      // 🔥 EXACT TIME CHECK
      if (now >= endDate) {
        // mark expired ONCE
        if (user.subscription.status !== "expired") {
          user.subscription.status = "expired";
          await user.subscription.save();
        }

        return res
          .status(403)
          .json({ code: "EXPIRED", message: "Subscription expired" });
      }

      subscription = user.subscription;
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      role: user.role,
      userId: user._id,
      isLoggedIn: true,
      subscription: user.subscription
        ? {
            _id: user.subscription._id,
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate,
            status: user.subscription.status,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
