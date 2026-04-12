const mongoose = require("mongoose");
const { env } = require("./env");
const logger = require("../utils/logger");

const connectDatabase = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info("MongoDB connected");
};

module.exports = connectDatabase;
