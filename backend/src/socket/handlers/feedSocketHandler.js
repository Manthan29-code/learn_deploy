const Follow = require("../../models/Follow");
const Note = require("../../models/Note");
const EVENT_TYPES = require("../../events/eventTypes");
const SOCKET_EVENTS = require("../socketEventNames");
const { DISCOVER_ROOM } = require("../roomNames");
const emitToUserRooms = require("../emitToUserRooms");
const serializeNote = require("../serializeNote");
const logger = require("../../utils/logger");

const toFollowerIds = async (authorId) => {
  const follows = await Follow.find({ following: authorId }).select("follower");
  return follows.map((item) => item.follower.toString());
};

const registerFeedSocketHandler = (io, eventBus) => {
  eventBus.on(EVENT_TYPES.NOTE_CREATED, async ({ noteId, actorId }) => {
    try {
      const note = await Note.findById(noteId).populate("author", "name email");
      if (!note) return;

      const notePayload = serializeNote(note);
      const followerIds = await toFollowerIds(actorId);
      const recipientIds = [...followerIds, actorId];

      if (note.isPublic) {
        io.to(DISCOVER_ROOM).emit(SOCKET_EVENTS.FEED_NOTE_CREATED, { note: notePayload });
      }

      emitToUserRooms(io, recipientIds, SOCKET_EVENTS.FEED_NOTE_CREATED, { note: notePayload });
    } catch (error) {
      logger.error("Socket feed create event failed", { error: error.message, noteId, actorId });
    }
  });

  eventBus.on(EVENT_TYPES.NOTE_UPDATED, async ({ noteId, actorId }) => {
    try {
      const note = await Note.findById(noteId).populate("author", "name email");
      if (!note) return;

      const notePayload = serializeNote(note);
      const followerIds = await toFollowerIds(actorId);
      const recipientIds = [...followerIds, actorId];

      io.to(DISCOVER_ROOM).emit(SOCKET_EVENTS.FEED_NOTE_UPDATED, { note: notePayload });
      emitToUserRooms(io, recipientIds, SOCKET_EVENTS.FEED_NOTE_UPDATED, { note: notePayload });
    } catch (error) {
      logger.error("Socket feed update event failed", { error: error.message, noteId, actorId });
    }
  });

  eventBus.on(EVENT_TYPES.NOTE_DELETED, async ({ noteId, actorId }) => {
    try {
      const followerIds = await toFollowerIds(actorId);
      const recipientIds = [...followerIds, actorId];
      const payload = { noteId, authorId: actorId };

      io.to(DISCOVER_ROOM).emit(SOCKET_EVENTS.FEED_NOTE_DELETED, payload);
      emitToUserRooms(io, recipientIds, SOCKET_EVENTS.FEED_NOTE_DELETED, payload);
    } catch (error) {
      logger.error("Socket feed delete event failed", { error: error.message, noteId, actorId });
    }
  });
};

module.exports = registerFeedSocketHandler;
