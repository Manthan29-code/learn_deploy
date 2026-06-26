import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const GEMINI_MODEL_PATTERN = /^gemini-[a-z0-9.-]+$/i;

const AiConfigPage = () => {
  const {
    user,
    updateAiConfig,
    aiConfigUpdating,
    aiConfigError,
    clearConfigError,
  } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState(null);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    return () => clearConfigError();
  }, [clearConfigError]);

  if (!user) {
    return null;
  }

  const savedModel = user.aiConfig?.geminiModel || "";
  const modelValue = geminiModel ?? savedModel;

  const validate = () => {
    const trimmedModel = modelValue.trim();
    if (trimmedModel && !GEMINI_MODEL_PATTERN.test(trimmedModel)) {
      return "Gemini model must look like gemini-2.5-flash";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearConfigError();
    setSuccessMessage("");

    const error = validate();
    if (error) {
      setLocalError(error);
      return;
    }

    setLocalError("");
    const result = await updateAiConfig({
      apiKey: apiKey.trim(),
      geminiModel: modelValue.trim(),
    });

    if (!result.error) {
      setApiKey("");
      setGeminiModel(modelValue.trim());
      setSuccessMessage("AI settings updated.");
    }
  };

  const handleClear = async () => {
    clearConfigError();
    setLocalError("");
    setSuccessMessage("");

    const result = await updateAiConfig({ apiKey: "", geminiModel: "", clearCustom: true });
    if (!result.error) {
      setApiKey("");
      setGeminiModel("");
      setSuccessMessage("Custom AI settings cleared.");
    }
  };

  const effectiveModel = user.aiConfig?.hasServerApiKey
    ? user.aiConfig.serverModel
    : user.aiConfig?.geminiModel || user.aiConfig?.serverModel || "gemini-2.5-flash";

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-white/10 bg-card/70 p-5">
        <h2 className="text-2xl font-black text-slate-50">AI Settings</h2>
        <p className="mt-2 text-sm text-slate-300">
          The app uses the server AI configuration first. Your saved key and model are used only when the server does not provide them.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Server Key</p>
          <p className="mt-2 text-sm font-semibold text-slate-100">{user.aiConfig?.hasServerApiKey ? "Configured" : "Missing"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Custom Key</p>
          <p className="mt-2 text-sm font-semibold text-slate-100">{user.aiConfig?.hasCustomApiKey ? "Saved" : "Not saved"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Effective Model</p>
          <p className="mt-2 break-words text-sm font-semibold text-slate-100">{effectiveModel}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-card/70 p-5">
        <div className="space-y-2">
          <label htmlFor="ai-api-key" className="text-sm font-semibold text-slate-200">
            API key
          </label>
          <input
            id="ai-api-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={user.aiConfig?.hasCustomApiKey ? "Leave blank to keep saved key" : "Paste your Google AI Studio key"}
            className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent"
          />
          <p className="text-xs text-slate-400">Leave blank to keep the current saved key. Use Clear custom to remove all saved AI settings.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="gemini-model" className="text-sm font-semibold text-slate-200">
            Gemini model
          </label>
          <input
            id="gemini-model"
            value={modelValue}
            onChange={(event) => setGeminiModel(event.target.value)}
            placeholder="gemini-2.5-flash"
            className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent"
          />
          <p className="text-xs text-slate-400">Examples: gemini-2.5-flash, gemini-2.5-pro</p>
        </div>

        {localError ? <p className="text-sm text-rose-300">{localError}</p> : null}
        {aiConfigError ? <p className="text-sm text-rose-300">{aiConfigError}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={aiConfigUpdating}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-70"
          >
            {aiConfigUpdating ? "Saving..." : "Save AI"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={aiConfigUpdating || (!user.aiConfig?.hasCustomApiKey && !user.aiConfig?.geminiModel)}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50"
          >
            Clear custom
          </button>
        </div>
      </form>
    </section>
  );
};

export default AiConfigPage;
