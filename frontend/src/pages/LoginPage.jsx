import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading, error, token, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [navigate, token]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form);
    if (!result.error) navigate("/");
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-md rounded-3xl border border-white/10 bg-card/80 p-6">
      <h1 className="text-3xl font-black text-slate-50">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-300">Login to continue posting and engaging with notes.</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 outline-none focus:border-accent"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 outline-none focus:border-accent"
        />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <motion.button whileTap={{ scale: 0.97 }} disabled={loading} className="w-full rounded-xl bg-accent px-4 py-2 font-bold text-slate-950">
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </form>
      <p className="mt-4 text-sm text-slate-300">
        New user? <Link to="/register" className="font-semibold text-accentSoft">Create account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
