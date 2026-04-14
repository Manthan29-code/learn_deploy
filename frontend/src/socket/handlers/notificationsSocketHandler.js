import SOCKET_EVENTS from "../socketEventNames";
import { addNotification } from "../../store/slices/notificationsSlice";

const registerNotificationsSocketHandler = ({ socket, dispatch }) => {
  const handleNotification = (payload) => {
    if (!payload?.message) return;

    dispatch(
      addNotification({
        type: payload.type || "info",
        message: payload.message,
        noteId: payload.noteId,
        actorId: payload.actorId,
      })
    );
  };

  socket.on(SOCKET_EVENTS.NOTIFICATION_PUSH, handleNotification);

  return () => {
    socket.off(SOCKET_EVENTS.NOTIFICATION_PUSH, handleNotification);
  };
};

export default registerNotificationsSocketHandler;
