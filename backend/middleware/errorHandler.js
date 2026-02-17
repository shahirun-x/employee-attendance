const { sendError } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

module.exports = function errorHandler(err, req, res, next) {
  // Log all errors for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method
    });
    if (err.stack) {
      console.error('Stack:', err.stack);
    }
  }

  // our custom errors
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode);
  }

  // mongoose validation
  if (err.name === 'ValidationError') {
    let msgs = Object.values(err.errors).map(e => e.message);
    console.error('Mongoose Validation Error:', msgs);
    return sendError(res, msgs.join('. '), 400);
  }

  // duplicate key
  if (err.code === 11000) {
    let field = Object.keys(err.keyPattern)[0];
    console.error(`Duplicate key error - ${field}:`, err.keyValue);
    return sendError(res, `${field} already exists`, 409);
  }

  // bad ObjectId
  if (err.name === 'CastError') {
    console.error('Invalid ObjectId:', err.value);
    return sendError(res, 'Invalid resource ID', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    console.error('JWT Error:', err.message);
    return sendError(res, 'Invalid authentication token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    console.error('Token Expired:', err.expiredAt);
    return sendError(res, 'Authentication token has expired', 401);
  }

  // Default error
  console.error('Unhandled Error:', err);
  return sendError(res, 'Internal server error', 500);
};
