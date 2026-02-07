// utils/generateToken.js
import jwt from "jsonwebtoken";
const ONE_WEEK = 24 * 60 * 60 * 7;
export const generateToken = (user) => {
  let secret;

  // choose secret based on role
  switch (user.role) {
    case "admin":
      secret = process.env.JWT_SECRET_ADMIN;
      break;
    case "seller":
      secret = process.env.JWT_SECRET_SELLER;
      break;
  }

  return jwt.sign(
    { id: user._id, role: user.role }, // payload
    secret, // role-specific secret
    { expiresIn: `${ONE_WEEK}s` }, // token expiry
  );
};
