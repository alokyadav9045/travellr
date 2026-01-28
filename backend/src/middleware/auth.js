const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

module.exports = (options = {}) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return next(ApiError.unauthorized('Authentication token not provided'));
    }

    const payload = jwt.verify(token, env.jwt.secret);
    // Attach minimal user info; controllers may fetch user as needed
    req.user = { id: payload.id, role: payload.role };

    // Optionally enforce roles
    if (options.roles && !options.roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    return next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};
