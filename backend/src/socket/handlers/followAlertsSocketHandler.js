const User = require("../../models/User");
const EVENT_TYPES = require("../../events/eventTypes");
const SOCKET_EVENTS = require("../socketEventNames");
const { toUserRoom } = require("../roomNames");
const logger = require("../../utils/logger");
const pickUserSafe = require("../../utils/pickUserSafe");

const findSafeActor = async (actorId) => {
  const actor = await User.findById(actorId);
  return actor ? pickUserSafe(actor) : null;
};

const emitFollowersCount = async (io, targetUserId, delta) => {
  const target = await User.findById(targetUserId).select("followersCount");

  io.to(toUserRoom(targetUserId)).emit(SOCKET_EVENTS.PROFILE_FOLLOWERS_COUNT_UPDATED, {
    userId: targetUserId,
    followersCount: target ? target.followersCount : null,
    delta,
  });
};

const registerFollowAlertsSocketHandler = (io, eventBus) => {
  eventBus.on(EVENT_TYPES.USER_FOLLOWED, async ({ actorId, targetUserId }) => {
    try {
      const actor = await findSafeActor(actorId);

      io.to(toUserRoom(targetUserId)).emit(SOCKET_EVENTS.FOLLOW_ALERT, {
        action: "followed",
        actorId,
        targetUserId,
        actor,
      });

      await emitFollowersCount(io, targetUserId, 1);
    } catch (error) {
      logger.error("Socket follow alert event failed", {
        error: error.message,
        actorId,
        targetUserId,
      });
    }
  });

  eventBus.on(EVENT_TYPES.USER_UNFOLLOWED, async ({ actorId, targetUserId }) => {
    try {
      const actor = await findSafeActor(actorId);

      io.to(toUserRoom(targetUserId)).emit(SOCKET_EVENTS.FOLLOW_ALERT, {
        action: "unfollowed",
        actorId,
        targetUserId,
        actor,
      });

      await emitFollowersCount(io, targetUserId, -1);
    } catch (error) {
      logger.error("Socket unfollow alert event failed", {
        error: error.message,
        actorId,
        targetUserId,
      });
    }
  });
};

module.exports = registerFollowAlertsSocketHandler;
