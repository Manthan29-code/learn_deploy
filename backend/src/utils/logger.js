const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevelName = process.env.LOG_LEVEL || "debug";
const currentLevel = levels[currentLevelName] ?? levels.debug;

const write = (level, message, meta) => {
  if ((levels[level] ?? 99) > currentLevel) {
    return;
  }

  const line = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(line));
    return;
  }

  console.log(JSON.stringify(line));
};

module.exports = {
  error: (message, meta) => write("error", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  info: (message, meta) => write("info", message, meta),
  debug: (message, meta) => write("debug", message, meta),
};
