import registerFeedSocketHandler from "./handlers/feedSocketHandler";
import registerLikesSocketHandler from "./handlers/likesSocketHandler";

const registerSocketHandlers = ({ socket, dispatch }) => {
  const cleanupFeed = registerFeedSocketHandler({ socket, dispatch });
  const cleanupLikes = registerLikesSocketHandler({ socket, dispatch });

  return () => {
    cleanupFeed();
    cleanupLikes();
  };
};

export default registerSocketHandlers;
