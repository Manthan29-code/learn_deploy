const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/mine", asyncHandler(authMiddleware), asyncHandler(noteController.listMyNotes));
router.get("/:noteId", asyncHandler(noteController.getNoteById));
router.post("/", asyncHandler(authMiddleware), asyncHandler(noteController.createNote));
router.patch("/:noteId", asyncHandler(authMiddleware), asyncHandler(noteController.updateNote));
router.delete("/:noteId", asyncHandler(authMiddleware), asyncHandler(noteController.deleteNote));

module.exports = router;
