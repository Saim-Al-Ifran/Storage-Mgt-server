const mongoose = require('mongoose');
const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
      index: true
    },

    originalName: {
      type: String,
      required: true,
      trim: true
    },

    mimeType: {
      type: String,
      required: true
    },

    sizeBytes: {
      type: Number,
      required: true,
      min: 0
    },

    // Cloudinary identifiers
    publicId: {
      type: String,
      required: true,
      unique: true
    },

    secureUrl: {
      type: String,
      required: true
    },

    // Optional integrity check (md5 / sha256)
    checksum: {
      type: String,
      index: true
    },

    // Soft delete support
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);


// Fast listing by folder
FileSchema.index({ ownerId: 1, folderId: 1, isDeleted: 1 });

// Prevent duplicate file names in same folder (ignores deleted files)
FileSchema.index(
  { ownerId: 1, folderId: 1, originalName: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);

module.exports = mongoose.model('File', FileSchema);
