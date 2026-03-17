const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/auth/logout');
    }
    res.render('profile/index', { title: 'My Profile', profileUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load profile.');
    res.redirect('/dashboard');
  }
};

// PUT /profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/profile');
    }

    // Check email uniqueness
    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        req.flash('error', 'Email already in use.');
        return res.redirect('/profile');
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (req.file) {
      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPath = path.join(__dirname, '..', 'public', 'uploads', 'profiles', user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilePicture = req.file.filename;
    }

    await user.save({ validateBeforeSave: false });

    // Update session
    req.session.name = user.name;
    req.session.email = user.email;
    req.session.profilePicture = user.profilePicture;

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update profile.');
    res.redirect('/profile');
  }
};

// PUT /profile/password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile');
    }

    if (newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/profile');
    }

    const user = await User.findById(req.session.userId).select('+password');
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/profile');
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/profile');
    }

    user.password = newPassword;
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not change password.');
    res.redirect('/profile');
  }
};
