const Follow = require("../models/Follow");
const Note = require("../models/Note");
const Reaction = require("../models/Reaction");
const sendResponse = require("../utils/apiResponse");

const addLikeState = async (notes, userId) => {
  const noteObjects = notes.map((note) => note.toObject());
  if (!userId || !noteObjects.length) {
    return noteObjects;
  }

  const likedNotes = await Reaction.find({
    user: userId,
    note: { $in: noteObjects.map((note) => note._id) },
    type: "like",
  }).select("note").lean();
  const likedNoteIds = new Set(likedNotes.map((reaction) => reaction.note.toString()));

  return noteObjects.map((note) => ({
    ...note,
    likedByMe: likedNoteIds.has(note._id.toString()),
  }));
};

const getDiscoverNotes = async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 50);
  const page = Math.max(Number(req.query.page || 1), 1);
  const skip = (page - 1) * limit;

  const notes = await Note.find({ isPublic: true })
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Note.countDocuments({ isPublic: true });
  const notesWithLikeState = await addLikeState(notes, req.user?._id);

  return sendResponse(res, 200, {
    notes: notesWithLikeState,
    pagination: { page, limit, total },
  });
};

const getMyFeed = async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 50);
  const page = Math.max(Number(req.query.page || 1), 1);
  const skip = (page - 1) * limit;

  const followingDocs = await Follow.find({ follower: req.user._id }).select("following");
  const followingIds = followingDocs.map((doc) => doc.following);

  const notes = await Note.find({
    $or: [
      { author: req.user._id },
      { author: { $in: followingIds }, isPublic: true },
    ],
  })
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const notesWithLikeState = await addLikeState(notes, req.user._id);
  return sendResponse(res, 200, { notes: notesWithLikeState, pagination: { page, limit } });
};

module.exports = {
  getDiscoverNotes,
  getMyFeed,
};
