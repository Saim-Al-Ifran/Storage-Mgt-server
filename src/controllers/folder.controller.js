const Folder = require("../models/Folder");

/* ================= CREATE FOLDER ================= */
exports.createFolder = async (req, res) => {
  const { name, parentId = null } = req.body;
  const ownerId = req.user.id;

  let depth = 0;

  if (parentId) {
    const parent = await Folder.findOne({
      _id: parentId,
      ownerId,
      isDeleted: false
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent folder not found" });
    }

    depth = parent.depth + 1;
  }

  const folder = await Folder.create({
    name,
    ownerId,
    parentId,
    depth
  });

  res.status(201).json(folder);
};

/* ================= LIST FOLDERS ================= */
exports.listFolders = async (req, res) => {
  const ownerId = req.user.id;
  const { parentId = null, page = 1, limit = 20 } = req.query;

  const query = {
    ownerId,
    parentId,
    isDeleted: false
  };

  const folders = await Folder.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: 1 });

  res.json(folders);
};

/* ================= GET SINGLE FOLDER ================= */
exports.getFolder = async (req, res) => {
  const folder = await Folder.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
    isDeleted: false
  });

  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  res.json(folder);
};

/* ================= UPDATE FOLDER ================= */
exports.updateFolder = async (req, res) => {
  const { name } = req.body;

  const folder = await Folder.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user.id,
      isDeleted: false
    },
    { name },
    { new: true }
  );

  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  res.json(folder);
};

/* ================= SOFT DELETE FOLDER ================= */
exports.deleteFolder = async (req, res) => {
  const folder = await Folder.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user.id,
      isDeleted: false
    },
    { isDeleted: true },
    { new: true }
  );

  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  res.json({ message: "Folder deleted" });
};

/* ================= RESTORE FOLDER ================= */
exports.restoreFolder = async (req, res) => {
  const folder = await Folder.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user.id,
      isDeleted: true
    },
    { isDeleted: false },
    { new: true }
  );

  if (!folder) {
    return res.status(404).json({ message: "Folder not found or not deleted" });
  }

  res.json({ message: "Folder restored", folder });
};

/* ================= MOVE FOLDER ================= */
exports.moveFolder = async (req, res) => {
  const { newParentId } = req.body;
  const ownerId = req.user.id;
  const folderId = req.params.id;

  if (folderId === newParentId) {
    return res.status(400).json({ message: "Cannot move folder into itself" });
  }

  const folder = await Folder.findOne({
    _id: folderId,
    ownerId,
    isDeleted: false
  });

  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  let depth = 0;
  if (newParentId) {
    const parent = await Folder.findOne({
      _id: newParentId,
      ownerId,
      isDeleted: false
    });

    if (!parent) {
      return res.status(404).json({ message: "Target parent not found" });
    }

    // prevent cycles
    if (parent._id.equals(folder._id)) {
      return res.status(400).json({ message: "Invalid move" });
    }

    depth = parent.depth + 1;
  }

  folder.parentId = newParentId;
  folder.depth = depth;
  await folder.save();

  res.json({ message: "Folder moved", folder });
};

/* ================= SEARCH FOLDERS ================= */
exports.searchFolders = async (req, res) => {
  const { q } = req.query;

  const folders = await Folder.find({
    ownerId: req.user.id,
    isDeleted: false,
    name: { $regex: q, $options: "i" }
  });

  res.json(folders);
};
