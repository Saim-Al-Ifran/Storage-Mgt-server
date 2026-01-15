const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema(
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
      default: null
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      default: ''
    },

    tags: {
      type: [String],
      index: true
    },

    version: {
      type: Number,
      default: 1
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

// Full-text search support
NoteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
