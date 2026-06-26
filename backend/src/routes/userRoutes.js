const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", asyncHandler(userController.listUsers));
router.patch("/me", asyncHandler(authMiddleware), asyncHandler(userController.updateMe));
router.patch("/me/ai-config", asyncHandler(authMiddleware), asyncHandler(userController.updateMyAiConfig));
router.get("/:userId", asyncHandler(userController.getUserById));

module.exports = router;
