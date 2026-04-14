const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

const socketAuth = async (socket, next) => {
  const authToken = socket.handshake.auth?.token;
  const headerValue = socket.handshake.headers?.authorization || "";
  const headerToken = headerValue.startsWith("Bearer ") ? headerValue.split(" ")[1] : null;
  const token = authToken || headerToken;

  // Allow anonymous socket clients for public discover updates.
  if (!token) {
    socket.data.user = null;
    return next();
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).select("name email");
    socket.data.user = user || null;
    return next();
  } catch (_error) {
    socket.data.user = null;
    return next();
  }
};

module.exports = socketAuth;
