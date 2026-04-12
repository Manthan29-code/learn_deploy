const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
};

const requiredKeys = ["MONGODB_URI", "JWT_SECRET"];

requiredKeys.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = { env };
