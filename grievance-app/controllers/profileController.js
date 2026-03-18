const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('profile/index', { title: 'My Profile', profileUser: user });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};

exports.putProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const update = { name, phone, address };
    if (req.file) update.profilePicture = '/uploads/attachments/' + req.file.filename;
    const user = await User.findByIdAndUpdate(req.session.user._id, update, { new: true });
    req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture };
    req.session.success = 'Profile updated successfully!';
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to update profile.';
    res.redirect('/profile');
  }
};

exports.putPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      req.session.error = 'New passwords do not match.';
      return res.redirect('/profile');
    }
    if (newPassword.length < 6) {
      req.session.error = 'Password must be at least 6 characters.';
      return res.redirect('/profile');
    }
    const user = await User.findById(req.session.user._id);
    const match = await user.comparePassword(oldPassword);
    if (!match) {
      req.session.error = 'Old password is incorrect.';
      return res.redirect('/profile');
    }
    user.password = newPassword;
    await user.save();
    req.session.success = 'Password changed successfully!';
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to change password.';
    res.redirect('/profile');
  }
};
