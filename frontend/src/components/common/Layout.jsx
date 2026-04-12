import { motion } from "framer-motion";
import { FaRegStickyNote } from "react-icons/fa";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const linkClass = ({ isActive }) =>
  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-accent text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"
  }`;

const Layout = ({ onLogout, children }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#1e293b,_#020617_55%)] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-accentSoft">
            <FaRegStickyNote className="text-xl" />
            <p className="font-bold tracking-wide">LiveNotes</p>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              Feed
            </NavLink>
            <NavLink to="/users" className={linkClass}>
              <span className="inline-flex items-center gap-2">
                <FiUsers /> Users
              </span>
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          </nav>

          {user ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
            >
              <FiLogOut /> Logout
            </motion.button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
