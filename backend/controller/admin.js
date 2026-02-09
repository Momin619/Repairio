import Admin from "../model/admin.js"; // Admin model
import bcrypt from "bcryptjs"; // For password hashing and verification
import User from "../model/user.js"; // User model
import { generateToken } from "../utils/generateToken.js";
const ONE_WEEK = 24 * 60 * 60 * 7;
// Admin Signup
const NODE_ENV = process.env.NODE_ENV;
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if an admin with the same email already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password, // password should be hashed in the Admin schema pre-save hook
      role: "admin",
    });

    // Respond with success message
    res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (err) {
    // Handle unexpected server errors
    res.status(500).json({ message: err.message });
  }
};

// Admin Login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in DB
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin);

    // Respond with JWT token and admin info
    res.json({
      token,
      role: "admin",
      userId: admin._id,
      isLoggedIn: true,
      subscription: null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific user (by admin)

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find user by ID and populate subscription details
    const user = await User.findById(userId).populate("subscription");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
