const Favorite = require('../models/Favorite');
const File = require('../models/File');
const Folder = require('../models/Folder');

/**
 * ADD FAVORITE
 * POST /api/favorites
 */
exports.addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId, itemType } = req.body;

    if (!['file', 'folder'].includes(itemType)) {
      const error = new Error('Invalid item type');
      error.status = 400;
      throw error;
    }

    // Validate item ownership
    const Model = itemType === 'file' ? File : Folder;
    const item = await Model.findOne({
      _id: itemId,
      ownerId: userId,
      isDeleted: false
    });

    if (!item) {
      const error = new Error('Item not found');
      error.status = 404;
      throw error;
    }

    const favorite = await Favorite.create({
      ownerId: userId,
      itemId,
      itemType
    });

    res.status(201).json({
      message: 'Added to favorites',
      favorite
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Already in favorites';
      err.status = 409;
    }
    next(err);
  }
};

/**
 * GET FAVORITES
 * GET /api/favorites
 */
exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ ownerId: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: favorites.length,
      favorites
    });
  } catch (err) {
    next(err);
  }
};

/**
 * REMOVE FAVORITE
 * DELETE /api/favorites/:id
 */
exports.removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favId = req.params.id;

    const favorite = await Favorite.findOneAndDelete({
      _id: favId,
      ownerId: userId
    });

    if (!favorite) {
      const error = new Error('Favorite not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Removed from favorites'
    });
  } catch (err) {
    next(err);
  }
};
