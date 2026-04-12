const bcrypt = require("bcryptjs");
const Joi = require("joi");

const User = require("../models/User");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const { signToken } = require("../utils/jwt");
const pickUserSafe = require("../utils/pickUserSafe");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((d) => d.message));
  }

  const existing = await User.findOne({ email: value.email });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);
  const user = await User.create({
    name: value.name,
    email: value.email,
    password: hashedPassword,
  });

  const token = signToken({ userId: user._id.toString() });

  return sendResponse(
    res,
    201,
    {
      token,
      user: pickUserSafe(user),
    },
    "Registered successfully"
  );
};

const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((d) => d.message));
  }

  const user = await User.findOne({ email: value.email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(value.password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({ userId: user._id.toString() });

  return sendResponse(
    res,
    200,
    {
      token,
      user: pickUserSafe(user),
    },
    "Login successful"
  );
};

const me = async (req, res) => {
  return sendResponse(res, 200, { user: pickUserSafe(req.user) });
};

module.exports = {
  register,
  login,
  me,
};
