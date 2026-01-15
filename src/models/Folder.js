const mongoose = require("mongoose");
const { Schema } = mongoose;

const FolderSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true
    },

    depth: {
      type: Number,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

// Unique folder name per directory (ignoring deleted folders)
FolderSchema.index(
  { ownerId: 1, parentId: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);

module.exports = mongoose.model("Folder", FolderSchema);
