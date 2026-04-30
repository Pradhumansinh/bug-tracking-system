import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  No header
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    //  Wrong format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    //  Extract token safely
    const token = authHeader.split(" ")[1];

    //  Token missing after split
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    //  Attach user
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next()
  } else {
    res.status(403).json({
      message: "Admin access only"
    })
  }
}

export default protect

