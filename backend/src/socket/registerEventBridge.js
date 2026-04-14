const eventBus = require("../events/eventBus");
const registerFeedSocketHandler = require("./handlers/feedSocketHandler");
const registerLikesSocketHandler = require("./handlers/likesSocketHandler");
const registerFollowAlertsSocketHandler = require("./handlers/followAlertsSocketHandler");
const registerNotificationSocketHandler = require("./handlers/notificationSocketHandler");

let isRegistered = false;

const registerEventBridge = (io) => {
  // Prevent duplicate listeners when server initialization is re-entered.
  if (isRegistered) {
    return;
  }

  registerFeedSocketHandler(io, eventBus);
  registerLikesSocketHandler(io, eventBus);
  registerFollowAlertsSocketHandler(io, eventBus);
  registerNotificationSocketHandler(io, eventBus);
  isRegistered = true;
};

module.exports = registerEventBridge;
