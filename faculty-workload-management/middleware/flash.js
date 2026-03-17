function addFlash(req, type, message) {
  if (!req.session) return;
  req.session.flash = req.session.flash || [];
  req.session.flash.push({ type, message });
}

function flashMiddleware() {
  return (req, res, next) => {
    const flash = (req.session && req.session.flash) || [];
    if (req.session) req.session.flash = [];

    res.locals.flash = flash;
    res.locals.appName = process.env.APP_NAME || "Faculty Workload Manager";
    res.locals.currentPath = req.path;
    next();
  };
}

module.exports = { flashMiddleware, addFlash };

