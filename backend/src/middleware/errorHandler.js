const logger = require("../utils/logger");

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  logger.error("Request failed", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message: err.message,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      details: err.details || null,
    },
  });
};

module.exports = errorHandler;
