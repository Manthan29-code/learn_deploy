import { useState } from "react";
import { FiRefreshCcw, FiSend, FiZap } from "react-icons/fi";
import { generateNoteTitles, rewriteNoteDraft } from "../../services/api";

const REWRITE_MODES = ["clarity", "grammar", "tone", "structure"];

const NoteForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ title: "", content: "", isPublic: true });
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [titleAiLoading, setTitleAiLoading] = useState(false);
  const [titleAiError, setTitleAiError] = useState("");
  const [rewriteMode, setRewriteMode] = useState("clarity");
  const [rewriteSuggestion, setRewriteSuggestion] = useState("");
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteError, setRewriteError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenerateTitles = async () => {
    if (form.content.trim().length < 20) {
      setTitleAiError("Write at least 20 characters before asking AI for titles.");
      return;
    }

    setTitleAiLoading(true);
    setTitleAiError("");
    setTitleSuggestions([]);

    try {
      const titles = await generateNoteTitles(form.content.trim());
      setTitleSuggestions(titles);
    } catch (error) {
      setTitleAiError(error.response?.data?.error?.message || error.message || "Unable to generate title suggestions");
    } finally {
      setTitleAiLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (form.content.trim().length < 20) {
      setRewriteError("Write at least 20 characters before asking AI to rewrite the draft.");
      return;
    }

    setRewriteLoading(true);
    setRewriteError("");
    setRewriteSuggestion("");

    try {
      const response = await rewriteNoteDraft({
        title: form.title.trim(),
        content: form.content.trim(),
        mode: rewriteMode,
      });
      setRewriteSuggestion(response.content);
    } catch (error) {
      setRewriteError(error.response?.data?.error?.message || error.message || "Unable to rewrite this draft");
    } finally {
      setRewriteLoading(false);
    }
  };

  const applyTitleSuggestion = (title) => {
    setForm((prev) => ({ ...prev, title }));
    setTitleSuggestions([]);
  };

  const applyRewriteSuggestion = () => {
    setForm((prev) => ({ ...prev, content: rewriteSuggestion }));
    setRewriteSuggestion("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    await onSubmit(form);
    setForm({ title: "", content: "", isPublic: true });
    setTitleSuggestions([]);
    setTitleAiError("");
    setRewriteSuggestion("");
    setRewriteError("");
    setRewriteMode("clarity");
  };

  return (
    <form onSubmit={handleSubmit} className="h-fit space-y-3 rounded-2xl border border-white/10 bg-card/70 p-4 shadow-glow">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Note title"
        className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 outline-none focus:border-accent"
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Write your note..."
        rows={5}
        className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 outline-none focus:border-accent"
      />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleGenerateTitles}
          disabled={titleAiLoading || form.content.trim().length < 20}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-accent hover:text-accentSoft disabled:opacity-70"
        >
          <FiZap /> {titleAiLoading ? "Suggesting..." : "Suggest title"}
        </button>
        {titleAiError ? <p className="text-sm text-rose-300">{titleAiError}</p> : null}
        {titleSuggestions.length ? (
          <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/10 p-3">
            <p className="text-xs font-semibold uppercase text-accentSoft">AI title suggestions</p>
            <div className="flex flex-wrap gap-2">
              {titleSuggestions.map((title) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => applyTitleSuggestion(title)}
                  className="rounded-lg border border-white/15 bg-slate-950/40 px-3 py-1.5 text-left text-sm text-slate-100 hover:border-accent hover:text-accentSoft"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/30 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase text-slate-400" htmlFor="rewrite-mode">
              Rewrite focus
            </label>
            <select
              id="rewrite-mode"
              value={rewriteMode}
              onChange={(event) => setRewriteMode(event.target.value)}
              className="rounded-lg border border-white/15 bg-slate-900/80 px-2 py-1 text-sm text-slate-100 outline-none focus:border-accent"
            >
              {REWRITE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleRewrite}
            disabled={rewriteLoading || form.content.trim().length < 20}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-accent hover:text-accentSoft disabled:opacity-70"
          >
            <FiRefreshCcw /> {rewriteLoading ? "Rewriting..." : "Rewrite draft"}
          </button>
        </div>
        {rewriteError ? <p className="text-sm text-rose-300">{rewriteError}</p> : null}
        {rewriteSuggestion ? (
          <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/10 p-3">
            <p className="text-xs font-semibold uppercase text-accentSoft">AI rewrite</p>
            <p className="whitespace-pre-wrap text-sm text-slate-100">{rewriteSuggestion}</p>
            <button
              type="button"
              onClick={applyRewriteSuggestion}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-slate-950"
            >
              Use rewrite
            </button>
          </div>
        ) : null}
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
        Public note
      </label>
      <button
        disabled={loading}
        className="ml-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-semibold text-slate-950 disabled:opacity-70"
      >
        <FiSend /> {loading ? "Posting..." : "Post note"}
      </button>
    </form>
  );
};

export default NoteForm;
