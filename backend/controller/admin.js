import Admin from "../model/admin.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Admin created successfully",
      token: generateToken(admin._id),
      role: "admin",
      adminId: admin._id,
      isLoggedIn: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(admin);

    res.json({
      token: generateToken(admin._id),
      role: "admin",
      userId: admin._id,
      isLoggedIn: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
