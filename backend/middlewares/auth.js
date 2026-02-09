import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Admin from "../model/admin.js";

// Middleware: Protect Routes
// Ensures the request has a valid JWT and attaches the user/admin to req

export const protect = async (req, res, next) => {
  console.log("---- PROTECT MIDDLEWARE ----");

  // 1️⃣ Try to get token from cookie first
  let token = req.cookies?.token;

  // 2️⃣ Fallback: get token from Authorization header (if frontend sets it manually)
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedUnverified = jwt.decode(token);

    if (!decodedUnverified) throw new Error("Invalid token");

    let secret;
    switch (decodedUnverified.role) {
      case "admin":
        secret = process.env.JWT_SECRET_ADMIN;
        break;
      case "seller":
        secret = process.env.JWT_SECRET_SELLER;
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }

    const decoded = jwt.verify(token, secret);

    let userFound = null;
    if (decoded.role === "admin") {
      userFound = await Admin.findById(decoded.id).select("-password");
      req.admin = userFound;
    } else {
      userFound = await User.findById(decoded.id)
        .select("-password")
        .populate("subscription");
      req.user = userFound;
    }

    if (!userFound) {
      return res.status(401).json({ message: "User not found in DB" });
    }

    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// ============================
// Middleware: Admin Only Access
// Checks if the logged-in user is an admin
// ============================
export const isAdmin = (req, res, next) => {
  if (!req.admin) {
    // If req.admin is not set by protect middleware, deny access
    return res.status(403).json({ message: "Admin access only" });
  }
  // ✅ Admin confirmed, continue to next middleware/route
  next();
};
