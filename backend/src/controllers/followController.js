const Follow = require("../models/Follow");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const eventBus = require("../events/eventBus");
const EVENT_TYPES = require("../events/eventTypes");

const followUser = async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const target = await User.findById(userId);
  if (!target) {
    throw new ApiError(404, "Target user not found");
  }

  const existing = await Follow.findOne({ follower: req.user._id, following: userId });
  if (existing) {
    return sendResponse(res, 200, { follow: existing }, "Already following");
  }

  const follow = await Follow.create({ follower: req.user._id, following: userId });
  await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: 1 } });
  await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

  eventBus.emit(EVENT_TYPES.USER_FOLLOWED, {
    actorId: req.user._id.toString(),
    targetUserId: userId,
  });

  return sendResponse(res, 201, { follow }, "User followed");
};

const unfollowUser = async (req, res) => {
  const { userId } = req.params;

  const follow = await Follow.findOneAndDelete({
    follower: req.user._id,
    following: userId,
  });

  if (!follow) {
    return sendResponse(res, 200, { removed: false }, "Not following this user");
  }

  await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: -1 } });
  await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });

  eventBus.emit(EVENT_TYPES.USER_UNFOLLOWED, {
    actorId: req.user._id.toString(),
    targetUserId: userId,
  });

  return sendResponse(res, 200, { removed: true }, "User unfollowed");
};

const listFollowers = async (req, res) => {
  const { userId } = req.params;
  const follows = await Follow.find({ following: userId })
    .populate("follower", "name email bio followersCount followingCount noteCount")
    .sort({ createdAt: -1 });

  return sendResponse(res, 200, {
    followers: follows.map((item) => item.follower),
  });
};

const listFollowing = async (req, res) => {
  const { userId } = req.params;
  const follows = await Follow.find({ follower: userId })
    .populate("following", "name email bio followersCount followingCount noteCount")
    .sort({ createdAt: -1 });

  return sendResponse(res, 200, {
    following: follows.map((item) => item.following),
  });
};

module.exports = {
  followUser,
  unfollowUser,
  listFollowers,
  listFollowing,
};
