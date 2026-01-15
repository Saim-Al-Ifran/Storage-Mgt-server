// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true,
    },

    storageQuotaBytes: {
      type: Number,
      default: 15 * 1024 ** 3, // 15 GB
    },

    usedBytes: {
      type: Number,
      default: 0,  
    },

    refreshTokens: [
      {
        token: { type: String, required: true }, // store plain token
        createdAt: { type: Date, default: Date.now, index: true },
      },
    ],

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Optional: virtual field to hide sensitive info when returning user
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
