import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoteCard from "../components/notes/NoteCard";
import NoteForm from "../components/notes/NoteForm";
import {
  createNote,
  deleteNote,
  fetchDiscoverNotes,
  fetchMyFeed,
  likeNote,
  unlikeNote,
  updateNote,
} from "../store/slices/notesSlice";

const FeedPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { discoverNotes, feedNotes, likedByMe, submitLoading } = useSelector((state) => state.notes);
  const [activeView, setActiveView] = useState("mine");

  useEffect(() => {
    dispatch(fetchDiscoverNotes());
    if (user) {
      dispatch(fetchMyFeed());
    }
  }, [dispatch, user]);

  const currentUserId = user?._id || user?.id;
  const myNotes = feedNotes.filter((note) => note.author?._id === currentUserId);
  const otherUserNotes = discoverNotes.filter((note) => note.author?._id !== currentUserId);
  const resolvedView = user ? activeView : "discover";
  const activeList = !user ? discoverNotes : resolvedView === "mine" ? myNotes : otherUserNotes;
  const sectionTitle = !user ? "Discover notes" : resolvedView === "mine" ? "My notes" : "Other users";

  const handleCreate = async (payload) => {
    await dispatch(createNote(payload));
    dispatch(fetchMyFeed());
    dispatch(fetchDiscoverNotes());
  };

  const handleDelete = async (noteId) => {
    await dispatch(deleteNote(noteId));
  };

  const handleEdit = (note) => {
    const nextTitle = window.prompt("Update title", note.title);
    const nextContent = window.prompt("Update content", note.content);
    if (!nextTitle || !nextContent) return;
    dispatch(updateNote({ noteId: note._id, payload: { title: nextTitle, content: nextContent } }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {user ? <NoteForm onSubmit={handleCreate} loading={submitLoading} /> : <div className="h-fit rounded-2xl border border-white/10 bg-card/70 p-4 text-sm text-slate-300">Login to create and manage your notes.</div>}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-50">{sectionTitle}</h2>
          <p className="text-sm text-slate-400">{activeList.length} notes</p>
        </div>

        {user ? (
          <div className="inline-flex rounded-xl border border-white/15 bg-slate-900/70 p-1">
            <button
              type="button"
              onClick={() => setActiveView("mine")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                resolvedView === "mine"
                  ? "bg-accent text-slate-950"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              My notes
            </button>
            <button
              type="button"
              onClick={() => setActiveView("others")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                resolvedView === "others"
                  ? "bg-accent text-slate-950"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              Other users
            </button>
          </div>
        ) : null}

        {activeList.map((note) => (
          <div key={note._id}>
            <NoteCard
              note={note}
              isOwner={user?._id === note.author?._id || user?.id === note.author?._id}
              liked={Boolean(likedByMe[note._id])}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onLike={(id) => dispatch(likeNote(id))}
              onUnlike={(id) => dispatch(unlikeNote(id))}
              canUseAi={Boolean(user)}
            />
          </div>
        ))}

        {!activeList.length ? (
          <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-400">
            {user && resolvedView === "mine" ? "Create your first note." : "No notes yet. Be the first one to post."}
          </p>
        ) : null}
      </section>
    </div>
  );
};

export default FeedPage;
