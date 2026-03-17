const User = require("../models/User");

function attachUserMiddleware() {
  return async (req, res, next) => {
    res.locals.user = null;
    if (!req.session || !req.session.userId) return next();

    try {
      const user = await User.findById(req.session.userId).lean();
      if (!user) {
        req.session.userId = null;
        return next();
      }
      res.locals.user = user;
      return next();
    } catch (e) {
      return next(e);
    }
  };
}

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect("/auth/login");
}

function requireRole(role) {
  return (req, res, next) => {
    const user = res.locals.user;
    if (!user) return res.redirect("/auth/login");
    if (user.role !== role) return res.status(403).render("errors/403", { title: "Forbidden" });
    return next();
  };
}

module.exports = { attachUserMiddleware, requireAuth, requireRole };

