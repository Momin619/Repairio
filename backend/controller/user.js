import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({
      message: "Account created. Waiting for admin approval.",
      userId: user._id,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating account", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate subscription
    const user = await User.findOne({ email }).populate("subscription");
    if (!user)
      return res
        .status(401)
        .json({ code: "INVALID", message: "Invalid credentials" });

    // Check password
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

    // Only for sellers: check subscription
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

    // Successful login response
    res.json({
      token: generateToken(user),
      role: user.role,
      userId: user._id,
      isLoggedIn: true,
      subscriptionStatus, // null for non-sellers
      subscriptionEndDate, // null for non-sellers
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
