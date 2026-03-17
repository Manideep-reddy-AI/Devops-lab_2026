const mongoose = require("mongoose");

const ROLES = ["admin", "faculty"];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true, default: "faculty" },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    avatarPath: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;

