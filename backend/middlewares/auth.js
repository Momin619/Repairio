import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Admin from "../model/admin.js";

// ============================
// Middleware: Protect Routes
// Ensures the request has a valid JWT and attaches the user/admin to req
// ============================
export const protect = async (req, res, next) => {
  console.log("Protect middleware called");

  let token;

  // 1️⃣ Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from header
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If no token found, return 401
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 3️⃣ Decode token WITHOUT verification first to check role
    //    This is safe because we only want to know which secret to use
    const decodedUnverified = jwt.decode(token);
    if (!decodedUnverified) throw new Error("Invalid token");

    // 4️⃣ Choose the correct secret based on role in token
    let secret;
    switch (decodedUnverified.role) {
      case "admin":
        secret = process.env.JWT_SECRET_ADMIN;
        break;
      case "seller":
        secret = process.env.JWT_SECRET_SELLER;
        break;
      default:
        return res.status(401).json({ message: "Invalid role in token" });
    }

    // 5️⃣ Verify token with the correct role-specific secret
    const decoded = jwt.verify(token, secret);

    // 6️⃣ Attach user or admin to request object for next middleware/routes
    if (decoded.role === "admin") {
      // Admin: fetch from Admin collection
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) return res.status(401).json({ message: "Admin not found" });
      req.admin = admin;
      req.role = "admin";
    } else {
      // User/Seller: fetch from User collection
      const user = await User.findById(decoded.id)
        .select("-password")
        .populate("subscription"); // Include subscription info for seller
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
      req.role = decoded.role;
    }

    console.log("token", token);

    // ✅ Token is valid, move to next middleware/route handler
    next();
  } catch (err) {
    console.log(err);
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
