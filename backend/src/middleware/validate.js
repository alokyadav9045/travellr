const ApiError = require('../utils/ApiError');

// schema: Zod schema
// target: 'body' | 'params' | 'query' (default body)
module.exports = (schema, target = 'body') => (req, res, next) => {
  try {
    const input = req[target];
    if (!schema) return next();
    const result = schema.parse(input);
    // Replace the target with the parsed / sanitized value
    req[target] = result;
    return next();
  } catch (err) {
    return next(err);
  }
};
