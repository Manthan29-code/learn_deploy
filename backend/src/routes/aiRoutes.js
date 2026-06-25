const express = require("express");

const aiController = require("../controllers/aiController");
const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile/bio", asyncHandler(authMiddleware), asyncHandler(aiController.generateProfileBio));
router.post("/notes/title", asyncHandler(authMiddleware), asyncHandler(aiController.generateNoteTitles));

module.exports = router;
