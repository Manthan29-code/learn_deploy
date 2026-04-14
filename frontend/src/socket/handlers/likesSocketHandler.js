import SOCKET_EVENTS from "../socketEventNames";
import { applyRealtimeLikeCount } from "../../store/slices/notesSlice";

const registerLikesSocketHandler = ({ socket, dispatch }) => {
  const handleLiked = ({ noteId, likesCount }) => {
    if (!noteId || typeof likesCount !== "number") return;
    dispatch(applyRealtimeLikeCount({ noteId, likesCount }));
  };

  const handleUnliked = ({ noteId, likesCount }) => {
    if (!noteId || typeof likesCount !== "number") return;
    dispatch(applyRealtimeLikeCount({ noteId, likesCount }));
  };

  socket.on(SOCKET_EVENTS.NOTE_LIKED, handleLiked);
  socket.on(SOCKET_EVENTS.NOTE_UNLIKED, handleUnliked);

  return () => {
    socket.off(SOCKET_EVENTS.NOTE_LIKED, handleLiked);
    socket.off(SOCKET_EVENTS.NOTE_UNLIKED, handleUnliked);
  };
};

export default registerLikesSocketHandler;
