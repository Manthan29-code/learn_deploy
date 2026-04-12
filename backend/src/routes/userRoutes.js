const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", asyncHandler(userController.listUsers));
router.get("/:userId", asyncHandler(userController.getUserById));
router.patch("/me", asyncHandler(authMiddleware), asyncHandler(userController.updateMe));

module.exports = router;
