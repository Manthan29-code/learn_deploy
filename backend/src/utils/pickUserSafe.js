const { env } = require("../config/env");

const pickUserSafe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  noteCount: user.noteCount,
  followersCount: user.followersCount,
  followingCount: user.followingCount,
  aiConfig: {
    hasCustomApiKey: Boolean(user.aiConfig?.googleApiKey),
    geminiModel: user.aiConfig?.geminiModel || "",
    hasServerApiKey: Boolean(env.GOOGLE_API_KEY),
    serverModel: env.GEMINI_MODEL || env.DEFAULT_GEMINI_MODEL,
  },
  createdAt: user.createdAt,
});

module.exports = pickUserSafe;
