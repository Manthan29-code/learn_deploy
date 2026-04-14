const USER_ROOM_PREFIX = "user:";
const DISCOVER_ROOM = "feed:discover";

const toUserRoom = (userId) => `${USER_ROOM_PREFIX}${userId}`;

module.exports = {
  DISCOVER_ROOM,
  toUserRoom,
};
