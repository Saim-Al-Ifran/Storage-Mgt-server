const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const {refreshToken} = require('../secret');
/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    email,
    passwordHash,
    name
  });

  res.status(201).json({ message: "Registration successful" });
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, status: "active" });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token directly in DB (no hashing)
  user.refreshTokens.push({ token: refreshToken });
  user.lastLoginAt = new Date();
  await user.save();

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({ message: "Login successful" });
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken && req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Logged out successfully" });
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, refreshToken);
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Check token exists in DB
  const tokenExists = user.refreshTokens.find(
    (t) => t.token === refreshToken
  );

  if (!tokenExists) {
    return res.status(401).json({ message: "Refresh token revoked" });
  }

  // 🔁 Rotate refresh token
  user.refreshTokens = user.refreshTokens.filter(
    (t) => t.token !== refreshToken
  );

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    })
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({ message: "Token refreshed" });
};
