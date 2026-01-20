import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
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
    const user = await User.findOne({ email }).populate("subscription");
    if (!user) return res.status(401).json({ code: "INVALID" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ code: "INVALID" });

    if (!user.isActive) return res.status(403).json({ code: "INACTIVE" });

    if (
      user.role === "seller" &&
      (!user.subscription ||
        user.subscription.status !== "active" ||
        new Date() > user.subscription.endDate)
    ) {
      return res.status(403).json({ code: "NO_SUBSCRIPTION" });
    }

    res.json({
      token: generateToken(user),
      role: user.role,
      userId: user._id,
      isLoggedIn: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
