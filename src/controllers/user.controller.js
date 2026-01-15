const bcrypt = require("bcrypt");
const User = require("../models/User");

/* ================= CHANGE PASSWORD ================= */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!match) return res.status(400).json({ message: "Old password incorrect" });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.refreshTokens = []; // logout all sessions
  await user.save();

  res.json({ message: "Password changed successfully" });
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true }
  ).select("-passwordHash -refreshTokens");

  res.json({ message: "Profile updated", user });
};
