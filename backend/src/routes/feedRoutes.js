const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const feedController = require("../controllers/feedController");

const router = express.Router();

router.get("/discover", asyncHandler(feedController.getDiscoverNotes));
router.get("/me", asyncHandler(authMiddleware), asyncHandler(feedController.getMyFeed));

module.exports = router;
