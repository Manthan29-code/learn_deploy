const Follow = require("../../models/Follow");
const Note = require("../../models/Note");
const EVENT_TYPES = require("../../events/eventTypes");
const SOCKET_EVENTS = require("../socketEventNames");
const { DISCOVER_ROOM } = require("../roomNames");
const emitToUserRooms = require("../emitToUserRooms");
const logger = require("../../utils/logger");

const getRecipientsForNote = async (note) => {
  const follows = await Follow.find({ following: note.author }).select("follower");
  const followerIds = follows.map((item) => item.follower.toString());
  return [...followerIds, note.author.toString()];
};

const registerLikesSocketHandler = (io, eventBus) => {
  eventBus.on(EVENT_TYPES.NOTE_LIKED, async ({ noteId, actorId }) => {
    try {
      const note = await Note.findById(noteId).select("author likesCount isPublic");
      if (!note) return;

      const payload = { noteId, actorId, likesCount: note.likesCount };
      const recipientIds = await getRecipientsForNote(note);

      if (note.isPublic) {
        io.to(DISCOVER_ROOM).emit(SOCKET_EVENTS.NOTE_LIKED, payload);
      }

      emitToUserRooms(io, recipientIds, SOCKET_EVENTS.NOTE_LIKED, payload);
    } catch (error) {
      logger.error("Socket like event failed", { error: error.message, noteId, actorId });
    }
  });

  eventBus.on(EVENT_TYPES.NOTE_UNLIKED, async ({ noteId, actorId }) => {
    try {
      const note = await Note.findById(noteId).select("author likesCount isPublic");
      if (!note) return;

      const payload = { noteId, actorId, likesCount: note.likesCount };
      const recipientIds = await getRecipientsForNote(note);

      if (note.isPublic) {
        io.to(DISCOVER_ROOM).emit(SOCKET_EVENTS.NOTE_UNLIKED, payload);
      }

      emitToUserRooms(io, recipientIds, SOCKET_EVENTS.NOTE_UNLIKED, payload);
    } catch (error) {
      logger.error("Socket unlike event failed", { error: error.message, noteId, actorId });
    }
  });
};

module.exports = registerLikesSocketHandler;
