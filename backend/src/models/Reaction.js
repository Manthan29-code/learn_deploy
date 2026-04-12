const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true, index: true },
    type: { type: String, enum: ["like"], default: "like" },
  },
  { timestamps: true }
);

reactionSchema.index({ user: 1, note: 1 }, { unique: true });

module.exports = mongoose.model("Reaction", reactionSchema);
