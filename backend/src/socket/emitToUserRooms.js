const { toUserRoom } = require("./roomNames");

const emitToUserRooms = (io, userIds, eventName, payload) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean).map((id) => id.toString()))];

  uniqueUserIds.forEach((userId) => {
    io.to(toUserRoom(userId)).emit(eventName, payload);
  });
};

module.exports = emitToUserRooms;
