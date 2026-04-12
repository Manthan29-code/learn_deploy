const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

const authMiddleware = async (req, _res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization header"));
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = authMiddleware;
