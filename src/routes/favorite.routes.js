const express = require('express');
const router = express.Router();

const auth = require("../middlewares/auth");
const favoriteController = require('../controllers/favorite.controller');

router.post('/', auth, favoriteController.addFavorite);
router.get('/', auth, favoriteController.getFavorites);
router.delete('/:id', auth, favoriteController.removeFavorite);

module.exports = router;
