const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route (Admin only)
exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User inactive or not found" });
    }

    // Since only admin exists, no role check needed
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
