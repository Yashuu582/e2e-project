exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Access denied for your role' });
    }
    next();
  };
};
