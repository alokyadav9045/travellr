const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  if (!err) return next();

  // If it's a known ApiError
  if (err instanceof ApiError) {
    logger.error(err.message, { errors: err.errors });
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle validation errors (Zod)
  if (err && err.name === 'ZodError') {
    const formatted = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    const apiErr = ApiError.validationError(formatted);
    logger.warn('Validation failed', { details: formatted });
    return res.status(apiErr.statusCode).json(apiErr.toJSON());
  }

  // Generic error fallback
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  const apiErr = ApiError.internal('Something went wrong');
  return res.status(apiErr.statusCode).json(apiErr.toJSON());
};
