const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const followController = require("../controllers/followController");

const router = express.Router();

router.get("/:userId/followers", asyncHandler(followController.listFollowers));
router.get("/:userId/following", asyncHandler(followController.listFollowing));
router.post("/:userId", asyncHandler(authMiddleware), asyncHandler(followController.followUser));
router.delete("/:userId", asyncHandler(authMiddleware), asyncHandler(followController.unfollowUser));

module.exports = router;
