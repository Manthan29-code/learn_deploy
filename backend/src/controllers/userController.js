const Joi = require("joi");

const User = require("../models/User");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const pickUserSafe = require("../utils/pickUserSafe");

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().allow("").max(250),
}).min(1);

const listUsers = async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 50);
  const page = Math.max(Number(req.query.page || 1), 1);
  const skip = (page - 1) * limit;
  const q = (req.query.q || "").trim();

  const query = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await User.countDocuments(query);

  return sendResponse(res, 200, {
    users: users.map(pickUserSafe),
    pagination: { page, limit, total },
  });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sendResponse(res, 200, { user: pickUserSafe(user) });
};

const updateMe = async (req, res) => {
  const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((d) => d.message));
  }

  if (value.name !== undefined) req.user.name = value.name;
  if (value.bio !== undefined) req.user.bio = value.bio;
  await req.user.save();

  return sendResponse(res, 200, { user: pickUserSafe(req.user) }, "Profile updated");
};

module.exports = {
  listUsers,
  getUserById,
  updateMe,
};
