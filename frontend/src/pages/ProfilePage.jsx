import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2, FiSave, FiX, FiZap } from "react-icons/fi";
import { fetchFollowers, fetchFollowing } from "../store/slices/usersSlice";
import { fetchMyNotes } from "../store/slices/notesSlice";
import { generateProfileBio } from "../services/api";
import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { myNotes } = useSelector((state) => state.notes);
  const { followers, following, profileFollowersCount } = useSelector((state) => state.users);
  const { updateBio, profileUpdating, profileUpdateError, clearBioError } = useAuth();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [generatedBio, setGeneratedBio] = useState("");
  const [bioAiLoading, setBioAiLoading] = useState(false);
  const [bioAiError, setBioAiError] = useState("");

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      dispatch(fetchMyNotes());
      dispatch(fetchFollowers(userId));
      dispatch(fetchFollowing(userId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    return () => clearBioError();
  }, [clearBioError]);

  if (!user) {
    return <p className="rounded-2xl border border-white/10 bg-card/70 p-4 text-sm text-slate-300">Login to view your profile dashboard.</p>;
  }

  const userId = user._id || user.id;
  const letter = (user.name?.[0] || "U").toUpperCase();
  const remainingBioCharacters = 250 - bio.length;

  const startEditingBio = () => {
    clearBioError();
    setBioAiError("");
    setGeneratedBio("");
    setBio(user.bio || "");
    setIsEditingBio(true);
  };

  const cancelEditingBio = () => {
    clearBioError();
    setBioAiError("");
    setGeneratedBio("");
    setBio(user.bio || "");
    setIsEditingBio(false);
  };

  const handleGenerateBio = async () => {
    clearBioError();
    setBioAiError("");
    setBioAiLoading(true);
    setIsEditingBio(true);

    try {
      const suggestion = await generateProfileBio();
      setGeneratedBio(suggestion);
    } catch (error) {
      setBioAiError(error.response?.data?.error?.message || error.message || "Unable to generate bio");
    } finally {
      setBioAiLoading(false);
    }
  };

  const useGeneratedBio = () => {
    setBio(generatedBio);
    setGeneratedBio("");
  };

  const submitBio = async (event) => {
    event.preventDefault();
    if (bio.length > 250) return;

    const result = await updateBio(bio.trim());
    if (!result.error) {
      setGeneratedBio("");
      setIsEditingBio(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-card/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-black text-slate-950">{letter}</div>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-black text-slate-50">{user.name}</h2>
            <p className="break-words text-sm text-slate-400">{user.email}</p>
            <p className="break-words text-xs text-slate-500">User ID: {userId}</p>
          </div>
          {!isEditingBio ? (
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGenerateBio}
                disabled={bioAiLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-accent hover:text-accentSoft disabled:opacity-70"
              >
                <FiZap /> {bioAiLoading ? "Generating..." : "AI bio"}
              </button>
              <button
                type="button"
                onClick={startEditingBio}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-accent hover:text-accentSoft"
              >
                <FiEdit2 /> Edit bio
              </button>
            </div>
          ) : null}
        </div>
        {!isEditingBio ? (
          <>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-300">{user.bio || "No bio yet"}</p>
            {bioAiError ? <p className="mt-2 text-sm text-rose-300">{bioAiError}</p> : null}
          </>
        ) : (
          <form onSubmit={submitBio} className="mt-4 space-y-3">
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell people a little about yourself..."
              rows={4}
              maxLength={250}
              className="w-full resize-none rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent"
            />
            {generatedBio ? (
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
                <p className="text-xs font-semibold uppercase text-accentSoft">AI suggestion</p>
                <p className="mt-1 text-sm text-slate-100">{generatedBio}</p>
                <button
                  type="button"
                  onClick={useGeneratedBio}
                  className="mt-3 inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-slate-950"
                >
                  Use suggestion
                </button>
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`text-xs ${remainingBioCharacters < 0 ? "text-rose-300" : "text-slate-500"}`}>
                  {remainingBioCharacters} characters left
                </p>
                {profileUpdateError ? <p className="mt-1 text-sm text-rose-300">{profileUpdateError}</p> : null}
                {bioAiError ? <p className="mt-1 text-sm text-rose-300">{bioAiError}</p> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={bioAiLoading || profileUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 disabled:opacity-70"
                >
                  <FiZap /> {bioAiLoading ? "Generating..." : "Generate"}
                </button>
                <button
                  type="button"
                  onClick={cancelEditingBio}
                  disabled={profileUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 disabled:opacity-70"
                >
                  <FiX /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileUpdating || bio.length > 250}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-70"
                >
                  <FiSave /> {profileUpdating ? "Saving..." : "Save bio"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">Notes</p>
          <p className="mt-1 text-2xl font-black text-accentSoft">{myNotes.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">Followers</p>
          <p className="mt-1 text-2xl font-black text-accentSoft">{profileFollowersCount ?? followers.length}</p>
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
