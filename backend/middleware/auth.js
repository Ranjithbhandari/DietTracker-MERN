// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

// PROTECT MIDDLEWARE – checks for valid JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check header for "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized – no token provided',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request (most apps do this)
    req.user = { id: decoded.id };

    next(); // Continue to route
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized – invalid or expired token',
    });
  }
};

// GENERATE JWT TOKEN
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Better: 30 days (24h is too short for real apps)
  });
};