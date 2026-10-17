/**
 * Centralized Express error-handling middleware
 * Signature: (err, req, res, next)
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "An internal server error occurred";

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export default errorMiddleware;
