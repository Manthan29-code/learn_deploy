const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { env } = require("./config/env");
const routes = require("./routes");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: [env.CORS_ORIGIN, "https://learn-deploy-gold.vercel.app" ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
