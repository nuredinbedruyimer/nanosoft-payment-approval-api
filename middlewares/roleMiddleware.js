const requireRole = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    console.log(req.user.role);
    console.log(roles);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export default requireRole;
