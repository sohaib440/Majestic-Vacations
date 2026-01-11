module.exports = action => (req, res, next) => {
  console.log({
    user: req.user?.id,
    action,
    ip: req.ip,
    agent: req.headers['user-agent'],
    time: new Date()
  });
  next();
};
