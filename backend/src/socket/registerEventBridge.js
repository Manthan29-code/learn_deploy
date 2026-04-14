const eventBus = require("../events/eventBus");
const registerFeedSocketHandler = require("./handlers/feedSocketHandler");
const registerLikesSocketHandler = require("./handlers/likesSocketHandler");

let isRegistered = false;

const registerEventBridge = (io) => {
  // Prevent duplicate listeners when server initialization is re-entered.
  if (isRegistered) {
    return;
  }

  registerFeedSocketHandler(io, eventBus);
  registerLikesSocketHandler(io, eventBus);
  isRegistered = true;
};

module.exports = registerEventBridge;
