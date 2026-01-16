const File = require('../models/File');
const User = require('../models/User');
const Folder = require('../models/File')
const { uploadFileToCloudinary } = require('../utils/fileUpload');

const cloudinary = require('cloudinary').v2;

/**
 * GET FILE (Download URL)
 * GET /api/files/:id
 */
exports.getFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;

    const file = await File.findOne({
      _id: fileId,
      ownerId: userId,
      isDeleted: false
    });

    if (!file) {
      const error = new Error('File not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      id: file._id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      downloadUrl: file.secureUrl,
      createdAt: file.createdAt
    });
  } catch (err) {
    next(err);
  }
};
/**
 * Upload File
 * POST /api/files
 */
exports.uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { folderId = null } = req.body;

    const result = await uploadFileToCloudinary(req.file);

    // Save file metadata
    const file = await File.create({
      ownerId: userId,
      folderId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      publicId: result.public_id,
      secureUrl: result.secure_url
    });

    // Update storage usage (simple version)
    await User.findByIdAndUpdate(userId, {
      $inc: { usedBytes: req.file.size }
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file
    });
  } catch (err) {
    next(err);
  }
};

/**
 * MOVE FILE
 * PATCH /api/files/:id/move
 * body: { "newFolderId": "folder_id_or_null" }
 */
exports.moveFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    const { newFolderId = null } = req.body;

    const file = await File.findOne({
      _id: fileId,
      ownerId: userId,
      isDeleted: false
    });

    if (!file) {
      const error = new Error('File not found');
      error.status = 404;
      throw error;
    }

    // Validate target folder (if provided)
    if (newFolderId) {
      const folderExists = await Folder.findOne({
        _id: newFolderId,
        // ownerId: userId,
        isDeleted: false
      });
      console.log(newFolderId);
      console.log(folderExists);
      if (!folderExists) {
        const error = new Error('Target folder not found');
        error.status = 404;
        throw error;
      }
    }

    file.folderId = newFolderId;
    await file.save();

    res.status(200).json({
      message: 'File moved successfully',
      file
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Files List
 * GET /api/files
 * Filters:
 *  - type=image | pdf
 *  - folderId
 *  - page, limit
 */
exports.getFiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      folderId,
      type,
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      ownerId: userId,
      isDeleted: false
    };

    if (folderId) {
      query.folderId = folderId;
    }

    // File type filter
    if (type === 'image') {
      query.mimeType = { $regex: '^image/' };
    }

    if (type === 'pdf') {
      query.mimeType = 'application/pdf';
    }

    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      File.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      File.countDocuments(query)
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      files
    });
  } catch (err) {
    next(err);
  }
};


/**
 * DELETE FILE (Soft Delete + Cloudinary Destroy)
 * DELETE /api/files/:id
 */
exports.deleteFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;

    const file = await File.findOne({
      _id: fileId,
      ownerId: userId,
      isDeleted: false
    });

    if (!file) {
      const error = new Error('File not found');
      error.status = 404;
      throw error;
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Soft delete file
    file.isDeleted = true;
    await file.save();

    // Update user storage
    await User.findByIdAndUpdate(userId, {
      $inc: { usedBytes: -file.sizeBytes }
    });

    res.status(200).json({
      message: 'File deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};