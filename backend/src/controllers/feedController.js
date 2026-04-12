const Follow = require("../models/Follow");
const Note = require("../models/Note");
const sendResponse = require("../utils/apiResponse");

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

  return sendResponse(res, 200, {
    notes,
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

  return sendResponse(res, 200, { notes, pagination: { page, limit } });
};

module.exports = {
  getDiscoverNotes,
  getMyFeed,
};
