import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Admin from "../model/admin.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // decode first WITHOUT verification to know role
    const decodedUnverified = jwt.decode(token);
    if (!decodedUnverified) throw new Error("Invalid token");

    // pick secret based on role
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

    // now verify token with role-specific secret
    const decoded = jwt.verify(token, secret);

    // attach user/admin to request
    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) return res.status(401).json({ message: "Admin not found" });
      req.admin = admin;
      req.role = "admin";
    } else {
      const user = await User.findById(decoded.id)
        .select("-password")
        .populate("subscription");
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
      req.role = decoded.role;
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
