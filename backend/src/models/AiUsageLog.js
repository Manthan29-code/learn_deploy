const mongoose = require("mongoose");

const aiUsageLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    feature: {
      type: String,
      required: true,
      enum: [
        "bio_generator",
        "note_title_generator",
        "note_summarizer",
        "note_rewrite_assistant",
      ],
    },
    status: { type: String, required: true, enum: ["success", "failed"] },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

aiUsageLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AiUsageLog", aiUsageLogSchema);
