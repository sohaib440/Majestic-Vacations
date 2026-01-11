const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign({ id: user._id, role: user.userRole }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};
