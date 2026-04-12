require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/db");
const logger = require("./src/utils/logger");
const { env } = require("./src/config/env");

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(`API server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", { error: error.message });
    process.exit(1);
  }
};

startServer();
