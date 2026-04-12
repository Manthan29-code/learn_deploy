import { motion } from "framer-motion";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiTrash2, FiEdit3 } from "react-icons/fi";

const getInitial = (name) => (name?.trim()?.[0] || "U").toUpperCase();

const NoteCard = ({ note, isOwner, liked, onLike, onUnlike, onDelete, onEdit }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
    >
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
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onEdit(note)} className="rounded-lg bg-white/10 p-2 hover:bg-white/20">
              <FiEdit3 />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onDelete(note._id)} className="rounded-lg bg-rose-500/20 p-2 text-rose-200 hover:bg-rose-500/40">
              <FiTrash2 />
            </motion.button>
          </div>
        ) : null}
      </div>

      <h3 className="text-lg font-semibold text-slate-50">{note.title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{note.content}</p>

      <div className="mt-4 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => (liked ? onUnlike(note._id) : onLike(note._id))}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
        >
          {liked ? <FaHeart className="text-rose-400" /> : <FaRegHeart />} {note.likesCount || 0}
        </motion.button>
      </div>
    </motion.article>
  );
};

export default NoteCard;
