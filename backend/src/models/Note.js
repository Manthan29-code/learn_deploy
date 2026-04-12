const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isPublic: { type: Boolean, default: true, index: true },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

noteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
