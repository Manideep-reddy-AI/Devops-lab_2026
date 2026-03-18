const User = require('../models/User');
const Grievance = require('../models/Grievance');

exports.index = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const usersWithCount = await Promise.all(users.map(async u => {
      const count = await Grievance.countDocuments({ submittedBy: u._id });
      return { ...u.toObject(), grievanceCount: count };
    }));
    res.render('users/index', { title: 'User Management', users: usersWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};

exports.getEdit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).render('errors/404', { title: 'Not Found' });
    res.render('users/edit', { title: 'Edit User', editUser: user });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};

exports.putEdit = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role, isActive: isActive === 'on' });
    req.session.success = 'User updated successfully!';
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to update user.';
    res.redirect('/users');
  }
};

exports.delete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.session.success = 'User deleted successfully!';
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to delete user.';
    res.redirect('/users');
  }
};
