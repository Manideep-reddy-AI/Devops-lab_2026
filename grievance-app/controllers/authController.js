const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.session.error = 'Email and password are required.';
      return res.redirect('/auth/login');
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/auth/login');
    }
    if (!user.isActive) {
      req.session.error = 'Your account has been deactivated.';
      return res.redirect('/auth/login');
    }
    user.lastLogin = new Date();
    await user.save();
    req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture };
    req.session.success = `Welcome back, ${user.name}!`;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.error = 'Something went wrong. Please try again.';
    res.redirect('/auth/login');
  }
};

exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;
    if (!name || !email || !password) {
      req.session.error = 'All fields are required.';
      return res.redirect('/auth/register');
    }
    if (password !== confirmPassword) {
      req.session.error = 'Passwords do not match.';
      return res.redirect('/auth/register');
    }
    if (password.length < 6) {
      req.session.error = 'Password must be at least 6 characters.';
      return res.redirect('/auth/register');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.session.error = 'Email already registered.';
      return res.redirect('/auth/register');
    }
    const user = await User.create({ name, email, password, phone: phone || '', address: address || '', role: 'citizen' });
    req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture };
    req.session.success = `Account created successfully! Welcome, ${user.name}!`;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.error = 'Registration failed. Please try again.';
    res.redirect('/auth/register');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
