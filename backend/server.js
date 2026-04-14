require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDatabase = require("./src/config/db");
const logger = require("./src/utils/logger");
const { env } = require("./src/config/env");
const { initSocket } = require("./src/socket");

const startServer = async () => {
  try {
    await connectDatabase();
    const server = http.createServer(app);
    initSocket(server);

    server.listen(env.PORT, () => {
      logger.info(`API + socket server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", { error: error.message });
    process.exit(1);
  }
};

startServer();
