import registerFeedSocketHandler from "./handlers/feedSocketHandler";
import registerLikesSocketHandler from "./handlers/likesSocketHandler";
import registerFollowAlertsSocketHandler from "./handlers/followAlertsSocketHandler";
import registerNotificationsSocketHandler from "./handlers/notificationsSocketHandler";

const registerSocketHandlers = ({ socket, dispatch }) => {
  const cleanupFeed = registerFeedSocketHandler({ socket, dispatch });
  const cleanupLikes = registerLikesSocketHandler({ socket, dispatch });
  const cleanupFollowAlerts = registerFollowAlertsSocketHandler({ socket, dispatch });
  const cleanupNotifications = registerNotificationsSocketHandler({ socket, dispatch });

  return () => {
    cleanupFeed();
    cleanupLikes();
    cleanupFollowAlerts();
    cleanupNotifications();
  };
};

export default registerSocketHandlers;
