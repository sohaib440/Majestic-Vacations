module.exports = (...perms) => (req, res, next) => {
  const hasAll = perms.every(p => req.user.permissions.includes(p));
  if (!hasAll)
    return res.status(403).json({ message: 'Permission denied' });
  next();
};
