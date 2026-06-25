const ApiError = require("../../utils/apiError");
const { env } = require("../../config/env");

const loadLangChain = async () => {
  try {
    const [{ ChatGoogle }, zod] = await Promise.all([
      import("@langchain/google/node"),
      import("zod"),
    ]);

    return { ChatGoogle, z: zod.z };
  } catch (_error) {
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

const createModel = async ({ temperature = 0.4, maxOutputTokens = 2000 } = {}) => {
  if (!env.GOOGLE_API_KEY) {
    throw new ApiError(503, "Google AI API key is not configured. Set GOOGLE_API_KEY in backend .env");
  }

  const { ChatGoogle, z } = await loadLangChain();
  const model = new ChatGoogle({
    apiKey: env.GOOGLE_API_KEY,
    model: env.GEMINI_MODEL,
    temperature,
    maxOutputTokens,
    maxRetries: 2,
  });

  return { model, z };
};

const generateProfileBio = async (prompt) => {
  const { model, z } = await createModel({ temperature: 0.7, maxOutputTokens: 2000 });
  const schema = z.object({
    bio: z.string().min(1).max(160).describe("A short profile bio suggestion"),
  });

  try {
    const response = await withTimeout(model.withStructuredOutput(schema).invoke(prompt));
    return response
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, error.message || "Unable to generate profile bio with LangChain");
  }
};

const generateNoteTitles = async (prompt) => {
  const { model, z } = await createModel({ temperature: 0.5, maxOutputTokens: 2000 });
  const schema = z.object({
    titles: z.array(z.string().min(3).max(120)).min(1).max(3).describe("Note title suggestions"),
  });

  try {
    return await withTimeout(model.withStructuredOutput(schema).invoke(prompt));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, error.message || "Unable to generate note titles with LangChain");
  }
};

module.exports = {
  generateProfileBio,
  generateNoteTitles,
};
