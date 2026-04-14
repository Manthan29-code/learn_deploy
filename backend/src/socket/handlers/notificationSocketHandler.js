const Follow = require("../../models/Follow");
const Note = require("../../models/Note");
const User = require("../../models/User");
const EVENT_TYPES = require("../../events/eventTypes");
const SOCKET_EVENTS = require("../socketEventNames");
const { toUserRoom } = require("../roomNames");
const emitToUserRooms = require("../emitToUserRooms");
const logger = require("../../utils/logger");

const findActorName = async (actorId) => {
  const actor = await User.findById(actorId).select("name");
  return actor?.name || "Someone";
};

const registerNotificationSocketHandler = (io, eventBus) => {
  eventBus.on(EVENT_TYPES.USER_FOLLOWED, async ({ actorId, targetUserId }) => {
    try {
      const actorName = await findActorName(actorId);

      io.to(toUserRoom(targetUserId)).emit(SOCKET_EVENTS.NOTIFICATION_PUSH, {
        type: "follow",
        message: `${actorName} followed you`,
        actorId,
        targetUserId,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Socket follow notification failed", {
        error: error.message,
        actorId,
        targetUserId,
      });
    }
  });

  eventBus.on(EVENT_TYPES.NOTE_LIKED, async ({ actorId, noteId }) => {
    try {
      const note = await Note.findById(noteId).select("author title");
      if (!note) return;

      const recipientId = note.author.toString();
      if (recipientId === actorId) {
        return;
      }

      const actorName = await findActorName(actorId);
      io.to(toUserRoom(recipientId)).emit(SOCKET_EVENTS.NOTIFICATION_PUSH, {
        type: "like",
        message: `${actorName} liked your note`,
        actorId,
        noteId,
        noteTitle: note.title,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Socket like notification failed", {
        error: error.message,
        actorId,
        noteId,
      });
    }
  });

  eventBus.on(EVENT_TYPES.NOTE_CREATED, async ({ actorId, noteId }) => {
    try {
      const note = await Note.findById(noteId).select("title isPublic");
      if (!note || !note.isPublic) return;

      const follows = await Follow.find({ following: actorId }).select("follower");
      const recipientIds = follows.map((item) => item.follower.toString());
      if (!recipientIds.length) return;

      const actorName = await findActorName(actorId);
      emitToUserRooms(io, recipientIds, SOCKET_EVENTS.NOTIFICATION_PUSH, {
        type: "followed_user_note",
        message: `${actorName} posted a new note`,
        actorId,
        noteId,
        noteTitle: note.title,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Socket note notification failed", {
        error: error.message,
        actorId,
        noteId,
      });
    }
  });
};

module.exports = registerNotificationSocketHandler;
