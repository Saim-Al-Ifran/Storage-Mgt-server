const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const noteController = require("../controllers/note.controller");

// Create note
router.post("/", auth, noteController.createNote);

// List / search notes
router.get("/", auth, noteController.getNotes);

// Update note
router.put("/:id", auth, noteController.updateNote);

// Soft delete note
router.delete("/:id", auth, noteController.deleteNote);

module.exports = router;
