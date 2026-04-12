const pickUserSafe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  noteCount: user.noteCount,
  followersCount: user.followersCount,
  followingCount: user.followingCount,
  createdAt: user.createdAt,
});

module.exports = pickUserSafe;
