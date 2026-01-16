const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const auth = require("../middlewares/auth");
const fileController = require('../controllers/file.controller');

// Get files (with filters)
router.get('/',auth,fileController.getFiles);
// Get single file (download URL)
router.get('/:id', auth, fileController.getFile);
// Upload file
router.post('/',auth,upload.single('file'),fileController.uploadFile);
// Move file to another folder
router.patch('/:id/move', auth, fileController.moveFile);
// Soft delete file
router.delete('/:id', auth, fileController.deleteFile);

module.exports = router;
