const express = require("express");

const aiController = require("../controllers/aiController");
const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile/bio", asyncHandler(authMiddleware), asyncHandler(aiController.generateProfileBio));
router.post("/notes/title", asyncHandler(authMiddleware), asyncHandler(aiController.generateNoteTitles));
router.post("/notes/summary", asyncHandler(authMiddleware), asyncHandler(aiController.generateNoteSummary));
router.post("/notes/rewrite", asyncHandler(authMiddleware), asyncHandler(aiController.rewriteNote));

module.exports = router;
