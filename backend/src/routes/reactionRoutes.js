const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const reactionController = require("../controllers/reactionController");

const router = express.Router();

router.post("/:noteId/like", asyncHandler(authMiddleware), asyncHandler(reactionController.likeNote));
router.delete("/:noteId/like", asyncHandler(authMiddleware), asyncHandler(reactionController.unlikeNote));

module.exports = router;
