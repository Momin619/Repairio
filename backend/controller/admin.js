import Admin from "../model/admin.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* =========================
   ADMIN AUTH
========================= */

// Create admin (do this ONCE or protect this route)
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

// Admin login
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

    res.json({
      token: generateToken(admin._id),
      role: "admin",
      adminId: admin._id,
      isLoggedIn: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
