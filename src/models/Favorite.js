const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavoriteSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },

    itemType: {
      type: String,
      enum: ['file', 'folder'],
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Prevent duplicates
FavoriteSchema.index(
  { ownerId: 1, itemId: 1, itemType: 1 },
  { unique: true }
);

module.exports = mongoose.model('Favorite', FavoriteSchema);
