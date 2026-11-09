const logger = require("../utils/logger");

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  logger.error("Request failed", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction && statusCode >= 500
    ? "The server could not complete this request. Please try again later."
    : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: isProduction && statusCode >= 500 ? null : err.details || null,
    },
  });
};

module.exports = errorHandler;
