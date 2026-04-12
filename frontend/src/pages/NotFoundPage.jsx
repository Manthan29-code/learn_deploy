import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-white/10 bg-card/80 p-8 text-center">
      <p className="text-5xl font-black text-accent">404</p>
      <h1 className="mt-2 text-2xl font-black text-slate-50">Page not found</h1>
      <p className="mt-2 text-sm text-slate-300">The page you requested does not exist.</p>
      <Link to="/" className="mt-4 inline-block rounded-xl bg-accent px-4 py-2 font-bold text-slate-950">
        Go home
      </Link>
    </div>
  );
};

export default NotFoundPage;
