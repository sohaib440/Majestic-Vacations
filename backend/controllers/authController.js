const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Login
exports.login = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  const user = await User.findOne({ userEmail })
    .select("+userPassword +loginAttempts +lockUntil");

  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.isLocked()) return res.status(403).json({ message: "Account locked" });

  const isMatch = await user.comparePassword(userPassword);
  if (!isMatch) {
    user.loginAttempts++;
    if (user.loginAttempts >= 5) user.lockUntil = Date.now() + 30 * 60 * 1000;
    await user.save();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  // Sanitize user data to send to frontend
  const userData = {
    id: user._id,
    userName: user.userName,
    userEmail: user.userEmail,
    userRole: user.userRole,
    userPermissions: user.userPermissions,
    contactNumber: user.contactNumber || null,
  };

  res.json({
    token: generateToken(user),
    user: userData,
  });
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    // User is attached to req by the protect middleware
    const user = await User.findById(req.user.id).select('-userPassword -__v');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Check if user is locked
    if (user.isLocked()) {
      return res.status(403).json({ message: "Account is locked" });
    }

    // Return user data
    const userData = {
      id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userPermissions: user.userPermissions,
      contactNumber: user.contactNumber || null,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error" });
  }
};