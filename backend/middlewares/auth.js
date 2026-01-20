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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ADMIN
    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      req.admin = admin;
      req.role = "admin";
    }

    // USER (seller / customer)
    else {
      const user = await User.findById(decoded.id)
        .select("-password")
        .populate("subscription");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      req.role = user.role;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const isAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
