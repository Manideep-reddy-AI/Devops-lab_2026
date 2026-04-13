const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const Workload = require("../models/Workload");
const { addFlash } = require("../middleware/flash");

async function showProfile(req, res, next) {
  try {
    const user = await User.findById(res.locals.user._id).lean();
    return res.render("profile/edit", { title: "Profile Settings", profile: user });
  } catch (e) {
    return next(e);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(res.locals.user._id);
    if (!user) return res.redirect("/auth/login");

    const { name, department, email } = req.body;
    const cleanName = String(name || "").trim();
    const cleanDepartment = String(department || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!cleanName || !cleanDepartment || !normalizedEmail) {
      addFlash(req, "danger", "Name, Department, and Email are required.");
      return res.redirect("/profile");
    }

    const existingEmailOwner = await User.findOne({ email: normalizedEmail }).lean();
    if (existingEmailOwner && String(existingEmailOwner._id) !== String(user._id)) {
      addFlash(req, "danger", "Email is already used by another account.");
      return res.redirect("/profile");
    }

    user.name = cleanName;
    user.department = cleanDepartment;
    user.email = normalizedEmail;
    await user.save();

    // Keep denormalized workload fields consistent
    if (user.role === "faculty") {
      await Workload.updateMany(
        { faculty: user._id },
        { $set: { facultyName: user.name, department: user.department } }
      );
    }

    addFlash(req, "success", "Profile updated.");
    return res.redirect("/profile");
  } catch (e) {
    return next(e);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const user = await User.findById(res.locals.user._id);
    if (!user) return res.redirect("/auth/login");

    if (!req.file) {
      addFlash(req, "danger", "Please choose an image to upload.");
      return res.redirect("/profile");
    }

    const newPath = `/uploads/${req.file.filename}`;

    if (user.avatarPath) {
      const oldFsPath = path.join(__dirname, "..", "public", user.avatarPath.replace(/^\//, ""));
      if (fs.existsSync(oldFsPath)) {
        try {
          fs.unlinkSync(oldFsPath);
        } catch {
          // ignore delete failures
        }
      }
    }

    user.avatarPath = newPath;
    await user.save();

    addFlash(req, "success", "Avatar updated.");
    return res.redirect("/profile");
  } catch (e) {
    return next(e);
  }
}

async function showPassword(req, res) {
  return res.render("profile/password", { title: "Change Password" });
}

async function changePassword(req, res, next) {
  try {
    const user = await User.findById(res.locals.user._id);
    if (!user) return res.redirect("/auth/login");

    const { currentPassword, newPassword, confirmPassword } = req.body;
    const cur = String(currentPassword || "");
    const nextPass = String(newPassword || "");
    const confirm = String(confirmPassword || "");

    if (!cur || !nextPass || !confirm) {
      addFlash(req, "danger", "All fields are required.");
      return res.redirect("/profile/password");
    }
    if (nextPass.length < 8) {
      addFlash(req, "danger", "New password must be at least 8 characters.");
      return res.redirect("/profile/password");
    }
    if (nextPass !== confirm) {
      addFlash(req, "danger", "New password and confirmation do not match.");
      return res.redirect("/profile/password");
    }

    const ok = await bcrypt.compare(cur, user.passwordHash);
    if (!ok) {
      addFlash(req, "danger", "Current password is incorrect.");
      return res.redirect("/profile/password");
    }

    user.passwordHash = await bcrypt.hash(nextPass, 12);
    await user.save();

    addFlash(req, "success", "Password changed successfully.");
    return res.redirect("/profile");
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  showProfile,
  updateProfile,
  updateAvatar,
  showPassword,
  changePassword
};

