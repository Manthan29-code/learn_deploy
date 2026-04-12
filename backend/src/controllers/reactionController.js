const Reaction = require("../models/Reaction");
const Note = require("../models/Note");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const eventBus = require("../events/eventBus");
const EVENT_TYPES = require("../events/eventTypes");

const likeNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const existing = await Reaction.findOne({ user: req.user._id, note: noteId, type: "like" });
  if (existing) {
    return sendResponse(res, 200, { liked: true }, "Already liked");
  }

  await Reaction.create({ user: req.user._id, note: noteId, type: "like" });
  note.likesCount += 1;
  await note.save();

  eventBus.emit(EVENT_TYPES.NOTE_LIKED, {
    actorId: req.user._id.toString(),
    noteId,
  });

  return sendResponse(res, 201, { liked: true, likesCount: note.likesCount }, "Note liked");
};

const unlikeNote = async (req, res) => {
  const { noteId } = req.params;

  const removed = await Reaction.findOneAndDelete({ user: req.user._id, note: noteId, type: "like" });
  const note = await Note.findById(noteId);

  if (removed && note) {
    note.likesCount = Math.max(0, note.likesCount - 1);
    await note.save();

    eventBus.emit(EVENT_TYPES.NOTE_UNLIKED, {
      actorId: req.user._id.toString(),
      noteId,
    });
  }

  return sendResponse(
    res,
    200,
    {
      liked: false,
      likesCount: note ? note.likesCount : 0,
    },
    "Note unliked"
  );
};

module.exports = {
  likeNote,
  unlikeNote,
};
