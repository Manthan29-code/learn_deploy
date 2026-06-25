const Joi = require("joi");

const AiUsageLog = require("../models/AiUsageLog");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const aiGenerationService = require("../services/ai/geminiService");
const { buildBioPrompt, buildNoteTitlePrompt } = require("../services/ai/promptService");

const titleSchema = Joi.object({
  content: Joi.string().trim().min(20).max(2000).required(),
});

const logUsage = async ({ userId, feature, status, errorMessage = "" }) => {
  try {
    await AiUsageLog.create({ user: userId, feature, status, errorMessage });
  } catch (_error) {
    // AI logging should never break the user-facing feature.
  }
};

const sanitizeBio = (bio) => String(bio || "").replace(/\s+/g, " ").trim().slice(0, 160);

const sanitizeTitles = (titles) => {
  if (!Array.isArray(titles)) return [];

  const seen = new Set();
  return titles
    .map((title) => String(title || "").replace(/\s+/g, " ").trim())
    .filter((title) => title.length >= 3 && title.length <= 120)
    .filter((title) => {
      const key = title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
};

const generateProfileBio = async (req, res) => {
  try {
    const payload = await aiGenerationService.generateProfileBio(
      buildBioPrompt({
        name: req.user.name,
        bio: req.user.bio,
        noteCount: req.user.noteCount,
        followersCount: req.user.followersCount,
        followingCount: req.user.followingCount,
      })
    );
    
    const bio = sanitizeBio(payload.bio);
    if (!bio) {
      throw new ApiError(502, "AI did not return a usable bio");
    }

    await logUsage({ userId: req.user._id, feature: "bio_generator", status: "success" });
    return sendResponse(res, 200, { bio }, "Bio generated");
  } catch (error) {
    await logUsage({
      userId: req.user._id,
      feature: "bio_generator",
      status: "failed",
      errorMessage: error.message,
    });
    throw error;
  }
};

const generateNoteTitles = async (req, res) => {
  const { error, value } = titleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((detail) => detail.message));
  }

  try {
    const payload = await aiGenerationService.generateNoteTitles(
      buildNoteTitlePrompt({ content: value.content })
    );

    const titles = sanitizeTitles(payload.titles);
    if (!titles.length) {
      throw new ApiError(502, "AI did not return usable title suggestions");
    }

    await logUsage({ userId: req.user._id, feature: "note_title_generator", status: "success" });
    return sendResponse(res, 200, { titles }, "Note titles generated");
  } catch (error) {
    await logUsage({
      userId: req.user._id,
      feature: "note_title_generator",
      status: "failed",
      errorMessage: error.message,
    });
    throw error;
  }
};

module.exports = {
  generateProfileBio,
  generateNoteTitles,
};
