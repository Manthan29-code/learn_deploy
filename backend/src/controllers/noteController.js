const Joi = require("joi");

const Note = require("../models/Note");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const eventBus = require("../events/eventBus");
const EVENT_TYPES = require("../events/eventTypes");

const createSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).required(),
  content: Joi.string().trim().min(1).max(2000).required(),
  isPublic: Joi.boolean().default(true),
});

const updateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120),
  content: Joi.string().trim().min(1).max(2000),
  isPublic: Joi.boolean(),
}).min(1);

const createNote = async (req, res) => {
  const { error, value } = createSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((d) => d.message));
  }

  const note = await Note.create({
    ...value,
    author: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { noteCount: 1 } });

  const populated = await note.populate("author", "name email");
  eventBus.emit(EVENT_TYPES.NOTE_CREATED, {
    noteId: note._id.toString(),
    actorId: req.user._id.toString(),
  });

  return sendResponse(res, 201, { note: populated }, "Note created");
};

const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.noteId).populate("author", "name email");
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const isOwner = req.user && note.author._id.toString() === req.user._id.toString();
  if (!note.isPublic && !isOwner) {
    throw new ApiError(403, "You cannot view this private note");
  }

  return sendResponse(res, 200, { note });
};

const listMyNotes = async (req, res) => {
  const notes = await Note.find({ author: req.user._id }).sort({ createdAt: -1 });
  return sendResponse(res, 200, { notes });
};

const updateNote = async (req, res) => {
  const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((d) => d.message));
  }

  const note = await Note.findById(req.params.noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (note.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner can update this note");
  }

  Object.assign(note, value);
  await note.save();

  eventBus.emit(EVENT_TYPES.NOTE_UPDATED, {
    noteId: note._id.toString(),
    actorId: req.user._id.toString(),
  });

  return sendResponse(res, 200, { note }, "Note updated");
};

const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (note.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner can delete this note");
  }

  await Note.findByIdAndDelete(note._id);
  await User.findByIdAndUpdate(req.user._id, { $inc: { noteCount: -1 } });

  eventBus.emit(EVENT_TYPES.NOTE_DELETED, {
    noteId: note._id.toString(),
    actorId: req.user._id.toString(),
  });

  return sendResponse(res, 200, { noteId: note._id }, "Note deleted");
};

module.exports = {
  createNote,
  getNoteById,
  listMyNotes,
  updateNote,
  deleteNote,
};
