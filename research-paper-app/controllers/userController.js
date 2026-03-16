const User = require('../models/User');
const Paper = require('../models/Paper');

// GET /users — admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('users/index', { title: 'User Management', users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load users.');
    res.redirect('/dashboard');
  }
};

// GET /users/:id/edit
exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    res.render('users/edit', { title: 'Edit User', editUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load user.');
    res.redirect('/users');
  }
};

// PUT /users/:id/role
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'user'];

    if (!allowedRoles.includes(role)) {
      req.flash('error', 'Invalid role.');
      return res.redirect('/users');
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }

    // Update session if editing own role
    if (req.params.id === req.session.userId) {
      req.session.role = role;
    }

    req.flash('success', `Role updated to ${role} for ${user.name}.`);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update role.');
    res.redirect('/users');
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.session.userId) {
      req.flash('error', 'You cannot delete your own account from here.');
      return res.redirect('/users');
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }

    // Delete user's papers too
    await Paper.deleteMany({ uploadedBy: req.params.id });

    req.flash('success', `User ${user.name} deleted.`);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not delete user.');
    res.redirect('/users');
  }
};
