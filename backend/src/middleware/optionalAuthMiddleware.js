const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

const optionalAuthMiddleware = async (req, _res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization) {
    return next();
  }

  if (!authorization.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization header"));
  }

  try {
    const payload = verifyToken(authorization.split(" ")[1]);
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

module.exports = optionalAuthMiddleware;
