import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiAlignLeft, FiTrash2, FiEdit3 } from "react-icons/fi";
import { generateNoteSummary } from "../../services/api";

const getInitial = (name) => (name?.trim()?.[0] || "U").toUpperCase();

const NoteCard = ({ note, isOwner, liked, onLike, onUnlike, onDelete, onEdit, canUseAi }) => {
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const handleSummarize = async () => {
    if (!canUseAi) {
      return;
    }

    setSummaryLoading(true);
    setSummaryError("");

    try {
      const nextSummary = await generateNoteSummary({
        title: note.title,
        content: note.content,
      });
      setSummary(nextSummary);
    } catch (error) {
      setSummaryError(error.response?.data?.error?.message || error.message || "Unable to summarize this note");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accentSoft text-sm font-bold text-slate-950">
            {getInitial(note.author?.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{note.author?.name || "Unknown"}</p>
            <p className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {isOwner ? (
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onEdit(note)} className="rounded-lg bg-white/10 p-2 hover:bg-white/20">
              <FiEdit3 />
            </button>
            <button type="button" onClick={() => onDelete(note._id)} className="rounded-lg bg-rose-500/20 p-2 text-rose-200 hover:bg-rose-500/40">
              <FiTrash2 />
            </button>
          </div>
        ) : null}
      </div>

      <h3 className="text-lg font-semibold text-slate-50">{note.title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{note.content}</p>

      {summary ? (
        <div className="mt-3 rounded-xl border border-accent/30 bg-accent/10 p-3">
          <p className="text-xs font-semibold uppercase text-accentSoft">AI summary</p>
          <p className="mt-1 text-sm text-slate-100">{summary}</p>
        </div>
      ) : null}
      {summaryError ? <p className="mt-3 text-sm text-rose-300">{summaryError}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => (liked ? onUnlike(note._id) : onLike(note._id))}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
        >
          {liked ? <FaHeart className="text-rose-400" /> : <FaRegHeart />} {note.likesCount || 0}
        </button>
        {canUseAi ? (
          <button
            type="button"
            onClick={handleSummarize}
            disabled={summaryLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:border-accent hover:text-accentSoft disabled:opacity-70"
          >
            <FiAlignLeft /> {summaryLoading ? "Summarizing..." : summary ? "Refresh summary" : "Summarize"}
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default NoteCard;
