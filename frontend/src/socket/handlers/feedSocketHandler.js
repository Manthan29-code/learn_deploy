import SOCKET_EVENTS from "../socketEventNames";
import { removeRealtimeNote, upsertRealtimeNote } from "../../store/slices/notesSlice";

const registerFeedSocketHandler = ({ socket, dispatch }) => {
  const handleCreated = ({ note }) => {
    if (!note) return;
    dispatch(upsertRealtimeNote(note));
  };

  const handleUpdated = ({ note }) => {
    if (!note) return;
    dispatch(upsertRealtimeNote(note));
  };

  const handleDeleted = ({ noteId }) => {
    if (!noteId) return;
    dispatch(removeRealtimeNote(noteId));
  };

  socket.on(SOCKET_EVENTS.FEED_NOTE_CREATED, handleCreated);
  socket.on(SOCKET_EVENTS.FEED_NOTE_UPDATED, handleUpdated);
  socket.on(SOCKET_EVENTS.FEED_NOTE_DELETED, handleDeleted);

  return () => {
    socket.off(SOCKET_EVENTS.FEED_NOTE_CREATED, handleCreated);
    socket.off(SOCKET_EVENTS.FEED_NOTE_UPDATED, handleUpdated);
    socket.off(SOCKET_EVENTS.FEED_NOTE_DELETED, handleDeleted);
  };
};

export default registerFeedSocketHandler;
