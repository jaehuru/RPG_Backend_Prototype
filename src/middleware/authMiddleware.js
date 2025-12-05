const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ message: 'Authorization token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT authentication failed:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user; // Attach user payload to the request
    next();
  });
};

module.exports = authenticateToken;
