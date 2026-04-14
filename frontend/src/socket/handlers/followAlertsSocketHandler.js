import SOCKET_EVENTS from "../socketEventNames";
import { applyFollowAlert, applyProfileFollowersCountUpdate } from "../../store/slices/usersSlice";

const registerFollowAlertsSocketHandler = ({ socket, dispatch }) => {
  const handleFollowAlert = (payload) => {
    if (!payload?.targetUserId) return;
    dispatch(applyFollowAlert(payload));
  };

  const handleFollowersCountUpdate = (payload) => {
    if (!payload?.userId) return;
    dispatch(applyProfileFollowersCountUpdate(payload));
  };

  socket.on(SOCKET_EVENTS.FOLLOW_ALERT, handleFollowAlert);
  socket.on(SOCKET_EVENTS.PROFILE_FOLLOWERS_COUNT_UPDATED, handleFollowersCountUpdate);

  return () => {
    socket.off(SOCKET_EVENTS.FOLLOW_ALERT, handleFollowAlert);
    socket.off(SOCKET_EVENTS.PROFILE_FOLLOWERS_COUNT_UPDATED, handleFollowersCountUpdate);
  };
};

export default registerFollowAlertsSocketHandler;
