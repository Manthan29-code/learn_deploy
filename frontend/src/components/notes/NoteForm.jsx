import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

const NoteForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ title: "", content: "", isPublic: true });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    await onSubmit(form);
    setForm({ title: "", content: "", isPublic: true });
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
        rows={4}
        className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 outline-none focus:border-accent"
      />
      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
        Public note
      </label>
      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={loading}
        className="ml-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-semibold text-slate-950 disabled:opacity-70"
      >
        <FiSend /> {loading ? "Posting..." : "Post note"}
      </motion.button>
    </form>
  );
};

export default NoteForm;
