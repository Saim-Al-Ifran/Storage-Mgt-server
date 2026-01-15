const Note = require("../models/Note");
const mongoose = require("mongoose");

/* ================= CREATE NOTE ================= */
exports.createNote = async (req, res) => {
  const { title, content = "", folderId = null, tags = [] } = req.body;
  const ownerId = req.user.id;

  // Optional: validate folderId belongs to user
  if (folderId) {
    const Folder = require("../models/Folder");
    const folder = await Folder.findOne({ _id: folderId, ownerId, isDeleted: false });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
  }

  const note = await Note.create({
    title,
    content,
    folderId,
    tags,
    ownerId
  });

  res.status(201).json(note);
};

/* ================= GET NOTES (LIST/SEARCH) ================= */
exports.getNotes = async (req, res) => {
  const ownerId = req.user.id;
  const { folderId, q = "", page = 1, limit = 20 } = req.query;

  const query = { ownerId, isDeleted: false };

  if (folderId) query.folderId = folderId;

  if (q) {
    query.$text = { $search: q };
  }

  const notes = await Note.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ updatedAt: -1 });

  res.json(notes);
};

/* ================= UPDATE NOTE ================= */
exports.updateNote = async (req, res) => {
  const ownerId = req.user.id;
  const noteId = req.params.id;
  const { title, content, tags } = req.body;

  const note = await Note.findOne({ _id: noteId, ownerId, isDeleted: false });
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (tags !== undefined) note.tags = tags;

  // Increment version
  note.version += 1;
  await note.save();

  res.json(note);
};

/* ================= DELETE NOTE (SOFT DELETE) ================= */
exports.deleteNote = async (req, res) => {
  const ownerId = req.user.id;
  const noteId = req.params.id;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, ownerId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json({ message: "Note deleted" });
};
