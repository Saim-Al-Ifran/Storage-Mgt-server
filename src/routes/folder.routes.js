const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const folderController = require("../controllers/folder.controller");

router.post("/", auth, folderController.createFolder);
router.get("/", auth, folderController.listFolders);
router.get("/search", auth, folderController.searchFolders);
router.get("/:id", auth, folderController.getFolder);
router.put("/:id", auth, folderController.updateFolder);
router.delete("/:id", auth, folderController.deleteFolder);
router.patch("/:id/restore", auth, folderController.restoreFolder);
router.patch("/:id/move", auth, folderController.moveFolder);

module.exports = router;
