const { Server } = require("socket.io");

const { env } = require("../config/env");
const logger = require("../utils/logger");
const socketAuth = require("./socketAuth");
const registerEventBridge = require("./registerEventBridge");
const { DISCOVER_ROOM, toUserRoom } = require("./roomNames");

let ioInstance;

const initSocket = (httpServer) => {
  if (ioInstance) {
    return ioInstance;
  }

  ioInstance = new Server(httpServer, {
    cors: {
      origin: [env.CORS_ORIGIN, "https://learn-deploy-gold.vercel.app"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    transports: ["websocket", "polling"],
  });

  ioInstance.use(socketAuth);

  ioInstance.on("connection", (socket) => {
    socket.join(DISCOVER_ROOM);

    const userId = socket.data.user?._id?.toString();
    if (userId) {
      socket.join(toUserRoom(userId));
    }

    logger.debug("Socket client connected", {
      socketId: socket.id,
      userId: userId || null,
    });

    socket.on("disconnect", () => {
      logger.debug("Socket client disconnected", {
        socketId: socket.id,
        userId: userId || null,
      });
    });
  });

  registerEventBridge(ioInstance);
  return ioInstance;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized");
  }

  return ioInstance;
};

module.exports = {
  initSocket,
  getIO,
};
