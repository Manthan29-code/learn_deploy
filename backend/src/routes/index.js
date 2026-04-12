const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const noteRoutes = require("./noteRoutes");
const followRoutes = require("./followRoutes");
const reactionRoutes = require("./reactionRoutes");
const feedRoutes = require("./feedRoutes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Backend healthy" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/notes", noteRoutes);
router.use("/follows", followRoutes);
router.use("/reactions", reactionRoutes);
router.use("/feed", feedRoutes);

module.exports = router;
