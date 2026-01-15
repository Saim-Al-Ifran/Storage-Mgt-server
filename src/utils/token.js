const jwt = require("jsonwebtoken");
const {
    accessToken,
    refreshToken
  } = require('../secret');
const ACCESS_TOKEN_EXPIRES = "1h";
const REFRESH_TOKEN_EXPIRES = "7d";

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    accessToken,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
     refreshToken,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
};
