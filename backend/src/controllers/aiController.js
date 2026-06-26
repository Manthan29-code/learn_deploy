const Joi = require("joi");

const AiUsageLog = require("../models/AiUsageLog");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/apiResponse");
const aiGenerationService = require("../services/ai/geminiService");
const {
  buildBioPrompt,
  buildNoteTitlePrompt,
  buildNoteSummaryPrompt,
  buildNoteRewritePrompt,
} = require("../services/ai/promptService");

const titleSchema = Joi.object({
  content: Joi.string().trim().min(20).max(2000).required(),
});

const summarySchema = Joi.object({
  title: Joi.string().trim().allow("").max(120).default(""),
  content: Joi.string().trim().min(20).max(2000).required(),
});

const rewriteSchema = Joi.object({
  title: Joi.string().trim().allow("").max(120).default(""),
  content: Joi.string().trim().min(20).max(2000).required(),
  mode: Joi.string().valid("clarity", "grammar", "tone", "structure").default("clarity"),
});

const logUsage = async ({ userId, feature, status, errorMessage = "" }) => {
  try {
    await AiUsageLog.create({ user: userId, feature, status, errorMessage });
  } catch (_error) {
    // AI logging should never break the user-facing feature.
  }
};

const sanitizeBio = (bio) => String(bio || "").replace(/\s+/g, " ").trim().slice(0, 160);
const sanitizeSummary = (summary) => String(summary || "").replace(/\s+/g, " ").trim().slice(0, 280);
const sanitizeRewrite = (content) => String(content || "").replace(/\r\n/g, "\n").trim().slice(0, 2000);

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

const getAiOptions = (req) => ({ aiConfig: req.user.aiConfig || {} });

const generateProfileBio = async (req, res) => {
  try {
    const payload = await aiGenerationService.generateProfileBio(
      buildBioPrompt({
        name: req.user.name,
        bio: req.user.bio,
        noteCount: req.user.noteCount,
        followersCount: req.user.followersCount,
        followingCount: req.user.followingCount,
      }),
      getAiOptions(req)
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
      buildNoteTitlePrompt({ content: value.content }),
      getAiOptions(req)
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

const generateNoteSummary = async (req, res) => {
  const { error, value } = summarySchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((detail) => detail.message));
  }

  try {
    const payload = await aiGenerationService.generateNoteSummary(
      buildNoteSummaryPrompt({ title: value.title, content: value.content }),
      getAiOptions(req)
    );

    const summary = sanitizeSummary(payload.summary);
    if (!summary) {
      throw new ApiError(502, "AI did not return a usable summary");
    }

    await logUsage({ userId: req.user._id, feature: "note_summarizer", status: "success" });
    return sendResponse(res, 200, { summary }, "Note summary generated");
  } catch (error) {
    await logUsage({
      userId: req.user._id,
      feature: "note_summarizer",
      status: "failed",
      errorMessage: error.message,
    });
    throw error;
  }
};

const rewriteNote = async (req, res) => {
  const { error, value } = rewriteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, "Validation failed", error.details.map((detail) => detail.message));
  }

  try {
    const payload = await aiGenerationService.generateNoteRewrite(
      buildNoteRewritePrompt({
        title: value.title,
        content: value.content,
        mode: value.mode,
      }),
      getAiOptions(req)
    );

    const content = sanitizeRewrite(payload.content);
    if (!content) {
      throw new ApiError(502, "AI did not return usable rewritten content");
    }

    await logUsage({ userId: req.user._id, feature: "note_rewrite_assistant", status: "success" });
    return sendResponse(res, 200, { content, mode: value.mode }, "Note rewrite generated");
  } catch (error) {
    await logUsage({
      userId: req.user._id,
      feature: "note_rewrite_assistant",
      status: "failed",
      errorMessage: error.message,
    });
    throw error;
  }
};

module.exports = {
  generateProfileBio,
  generateNoteTitles,
  generateNoteSummary,
  rewriteNote,
};
