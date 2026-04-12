import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowers, fetchFollowing } from "../store/slices/usersSlice";
import { fetchMyNotes } from "../store/slices/notesSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { myNotes } = useSelector((state) => state.notes);
  const { followers, following } = useSelector((state) => state.users);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      dispatch(fetchMyNotes());
      dispatch(fetchFollowers(userId));
      dispatch(fetchFollowing(userId));
    }
  }, [dispatch, user]);

  if (!user) {
    return <p className="rounded-2xl border border-white/10 bg-card/70 p-4 text-sm text-slate-300">Login to view your profile dashboard.</p>;
  }

  const userId = user._id || user.id;
  const letter = (user.name?.[0] || "U").toUpperCase();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-card/70 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-black text-slate-950">{letter}</div>
          <div>
            <h2 className="text-2xl font-black text-slate-50">{user.name}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
            <p className="text-xs text-slate-500">User ID: {userId}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-300">{user.bio || "No bio yet"}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">Notes</p>
          <p className="mt-1 text-2xl font-black text-accentSoft">{myNotes.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">Followers</p>
          <p className="mt-1 text-2xl font-black text-accentSoft">{followers.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">Following</p>
          <p className="mt-1 text-2xl font-black text-accentSoft">{following.length}</p>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
