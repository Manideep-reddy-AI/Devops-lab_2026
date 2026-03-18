function attachUserMiddleware() {
  return (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.appName = process.env.APP_NAME || 'Grievance System';
    next();
  };
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Please login to continue.';
    return res.redirect('/auth/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.session.error = 'Access denied. Admins only.';
    return res.redirect('/dashboard');
  }
  next();
}

function requireOfficerOrAdmin(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'officer')) {
    req.session.error = 'Access denied.';
    return res.redirect('/dashboard');
  }
  next();
}

function redirectIfAuth(req, res, next) {
  if (req.session.user) return res.redirect('/dashboard');
  next();
}

module.exports = { attachUserMiddleware, requireAuth, requireAdmin, requireOfficerOrAdmin, redirectIfAuth };
