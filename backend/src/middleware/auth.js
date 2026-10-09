const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Express middleware that verifies the Bearer JWT and attaches the decoded
 * user payload to req.user. Responds 401 if the token is missing or invalid.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = { authenticate };
