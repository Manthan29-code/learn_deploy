import { motion } from "framer-motion";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";

const UserCard = ({ user, onFollow, onUnfollow, isFollowing }) => {
  const letter = (user.name?.[0] || "U").toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-black text-slate-900">
            {letter}
          </div>
          <div>
            <p className="font-semibold text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => (isFollowing ? onUnfollow(user.id || user._id) : onFollow(user.id || user._id))}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-slate-900"
        >
          {isFollowing ? <FiUserCheck /> : <FiUserPlus />} {isFollowing ? "Following" : "Follow"}
        </motion.button>
      </div>
      <p className="mt-3 text-sm text-slate-300">{user.bio || "No bio added yet."}</p>
    </motion.div>
  );
};

export default UserCard;
