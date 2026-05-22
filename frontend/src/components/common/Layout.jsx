import { useState } from "react";
import { FaRegStickyNote } from "react-icons/fa";
import { FiLogOut, FiMenu, FiUsers, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationToasts from "./NotificationToasts";

const linkClass = ({ isActive }) =>
  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-accent text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"
  }`;

const Layout = ({ onLogout, children }) => {
  const user = useSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#1e293b,_#020617_55%)] text-slate-100">
      <NotificationToasts />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-accentSoft">
            <FaRegStickyNote className="text-xl" />
            <p className="font-bold tracking-wide">LiveNote</p>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
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
            <button
              onClick={onLogout}
              className="hidden items-center gap-2 rounded-xl bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/30 md:inline-flex"
            >
              <FiLogOut /> Logout
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-100 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent md:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>

          {isMenuOpen ? (
            <div className="absolute left-4 right-4 top-full mt-2 rounded-xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/40 md:hidden">
              <nav className="flex flex-col gap-2">
                <NavLink to="/" onClick={closeMenu} className={linkClass}>
                  Feed
                </NavLink>
                <NavLink to="/users" onClick={closeMenu} className={linkClass}>
                  <span className="inline-flex items-center gap-2">
                    <FiUsers /> Users
                  </span>
                </NavLink>
                <NavLink to="/profile" onClick={closeMenu} className={linkClass}>
                  Profile
                </NavLink>
              </nav>

              {user ? (
                <button
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                >
                  <FiLogOut /> Logout
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
