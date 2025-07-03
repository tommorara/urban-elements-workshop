// middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
  // The 'protect' middleware should have already attached the user to req.user
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = adminMiddleware;
