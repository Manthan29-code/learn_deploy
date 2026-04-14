const serializeNote = (note) => ({
  _id: note._id,
  title: note.title,
  content: note.content,
  author: note.author,
  isPublic: note.isPublic,
  likesCount: note.likesCount,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});

module.exports = serializeNote;
