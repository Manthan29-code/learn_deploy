const ApiError = require("../../utils/apiError");
const { env } = require("../../config/env");
const logger = require("../../utils/logger");

const loadLangChain = async () => {
  try {
    const [{ ChatGoogle }, zod] = await Promise.all([
      import("@langchain/google/node"),
      import("zod"),
    ]);

    return { ChatGoogle, z: zod.z };
  } catch (error) {
    logger.error("Failed to load LangChain Google integration", {
      message: error.message,
      stack: error.stack,
    });
    throw new ApiError(
      503,
      "LangChain Google packages are not installed. Run npm install in backend."
    );
  }
};

const withTimeout = async (promise) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new ApiError(504, "AI request timed out")), env.AI_REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseStructuredResponse = (response, schema, fallbackMessage) => {
  if (response && typeof response === "object" && !Array.isArray(response) && !("content" in response)) {
    const result = schema.safeParse(response);
    if (result.success) {
      return result.data;
    }
  }

  const content = typeof response === "string" ? response : response?.content;
  const text = Array.isArray(content)
    ? content.map((part) => (typeof part === "string" ? part : part?.text || "")).join("")
    : typeof content === "string"
      ? content
      : content && typeof content === "object" && typeof content.text === "string"
        ? content.text
      : "";

  if (!text.trim()) {
    throw new ApiError(502, fallbackMessage);
  }

  const cleanedText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const jsonStart = cleanedText.indexOf("{");
  const jsonEnd = cleanedText.lastIndexOf("}");
  const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
    ? cleanedText.slice(jsonStart, jsonEnd + 1)
    : cleanedText;
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch (_error) {
    throw new ApiError(502, fallbackMessage);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new ApiError(502, fallbackMessage);
  }

  return result.data;
};

const resolveAiConfig = (aiConfig = {}) => {
  return {
    apiKey: env.GOOGLE_API_KEY || aiConfig.googleApiKey || "",
    model: env.GEMINI_MODEL || aiConfig.geminiModel || env.DEFAULT_GEMINI_MODEL,
  };
};

const createModel = async ({ temperature = 0.4, maxOutputTokens = 512, aiConfig } = {}) => {
  const resolved = resolveAiConfig(aiConfig);
  if (!resolved.apiKey) {
    throw new ApiError(503, "Google AI API key is not configured. Add GOOGLE_API_KEY in .env or save one in AI settings.");
  }

  const { ChatGoogle, z } = await loadLangChain();
  const model = new ChatGoogle({
    apiKey: resolved.apiKey,
    model: resolved.model,
    temperature,
    maxOutputTokens,
    maxRetries: 2,
  });

  return { model, z };
};

const invokeStructured = async ({ prompt, schema, temperature, maxOutputTokens, aiConfig, fallbackMessage }) => {
  try {
    const { model } = await createModel({ temperature, maxOutputTokens, aiConfig });
    const response = await withTimeout(model.invoke(prompt));
    return parseStructuredResponse(response, schema, fallbackMessage);
  } catch (error) {
    logger.error("AI generation failed", {
      feature: fallbackMessage,
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, error.message || fallbackMessage);
  }
};

const generateProfileBio = async (prompt, options = {}) => {
  const { z } = await loadLangChain();
  const schema = z.object({
    bio: z.string().min(1).max(160).describe("A short profile bio suggestion"),
  });

  return invokeStructured({
    prompt,
    schema,
    temperature: 0.7,
    maxOutputTokens: 128,
    aiConfig: options.aiConfig,
    fallbackMessage: "Unable to generate profile bio with LangChain",
  });
};

const generateNoteTitles = async (prompt, options = {}) => {
  const { z } = await loadLangChain();
  const schema = z.object({
    titles: z.array(z.string().min(3).max(120)).min(1).max(3).describe("Note title suggestions"),
  });

  return invokeStructured({
    prompt,
    schema,
    temperature: 0.5,
    maxOutputTokens: 192,
    aiConfig: options.aiConfig,
    fallbackMessage: "Unable to generate note titles with LangChain",
  });
};

const generateNoteSummary = async (prompt, options = {}) => {
  const { z } = await loadLangChain();
  const schema = z.object({
    summary: z.string().min(1).max(280).describe("A short summary of the note"),
  });

  return invokeStructured({
    prompt,
    schema,
    temperature: 0.3,
    maxOutputTokens: 160,
    aiConfig: options.aiConfig,
    fallbackMessage: "Unable to generate note summary with LangChain",
  });
};

const generateNoteRewrite = async (prompt, options = {}) => {
  const { z } = await loadLangChain();
  const schema = z.object({
    content: z.string().min(1).max(2000).describe("The rewritten note content"),
  });

  return invokeStructured({
    prompt,
    schema,
    temperature: 0.5,
    maxOutputTokens: 768,
    aiConfig: options.aiConfig,
    fallbackMessage: "Unable to rewrite note content with LangChain",
  });
};

module.exports = {
  generateProfileBio,
  generateNoteTitles,
  generateNoteSummary,
  generateNoteRewrite,
};
