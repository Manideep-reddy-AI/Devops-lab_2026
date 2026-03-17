const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { addFlash } = require("../middleware/flash");

function getRegisterRoleOptions({ canCreateAdmin }) {
  if (!canCreateAdmin) return [{ value: "faculty", label: "Faculty" }];
  return [
    { value: "admin", label: "Admin" },
    { value: "faculty", label: "Faculty" }
  ];
}

async function showLogin(req, res) {
  if (req.session && req.session.userId) return res.redirect("/dashboard");
  return res.render("auth/login", { title: "Login" });
}

async function showRegister(req, res, next) {
  try {
    if (req.session && req.session.userId) return res.redirect("/dashboard");
    const adminCount = await User.countDocuments({ role: "admin" });
    const roleOptions = getRegisterRoleOptions({ canCreateAdmin: adminCount === 0 });
    return res.render("auth/register", { title: "Register", roleOptions });
  } catch (e) {
    return next(e);
  }
}

async function postRegister(req, res, next) {
  try {
    const { name, department, email, password, role } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(name || "").trim();
    const cleanDepartment = String(department || "").trim();
    const cleanRole = String(role || "faculty").trim();
    const pass = String(password || "");

    if (!cleanName || !cleanDepartment || !normalizedEmail || !pass) {
      addFlash(req, "danger", "All fields are required.");
      return res.redirect("/auth/register");
    }
    if (pass.length < 8) {
      addFlash(req, "danger", "Password must be at least 8 characters.");
      return res.redirect("/auth/register");
    }

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      addFlash(req, "danger", "Email is already registered.");
      return res.redirect("/auth/register");
    }

    const adminCount = await User.countDocuments({ role: "admin" });
    const canCreateAdmin = adminCount === 0;
    const finalRole = canCreateAdmin && cleanRole === "admin" ? "admin" : "faculty";

    const passwordHash = await bcrypt.hash(pass, 12);
    const user = await User.create({
      name: cleanName,
      department: cleanDepartment,
      email: normalizedEmail,
      passwordHash,
      role: finalRole
    });

    req.session.userId = user._id.toString();
    addFlash(req, "success", "Welcome! Your account has been created.");
    return res.redirect("/dashboard");
  } catch (e) {
    return next(e);
  }
}

async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const pass = String(password || "");

    if (!normalizedEmail || !pass) {
      addFlash(req, "danger", "Email and password are required.");
      return res.redirect("/auth/login");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      addFlash(req, "danger", "Invalid email or password.");
      return res.redirect("/auth/login");
    }

    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) {
      addFlash(req, "danger", "Invalid email or password.");
      return res.redirect("/auth/login");
    }

    req.session.userId = user._id.toString();
    addFlash(req, "success", "Logged in successfully.");
    return res.redirect("/dashboard");
  } catch (e) {
    return next(e);
  }
}

async function postLogout(req, res, next) {
  try {
    if (!req.session) return res.redirect("/auth/login");
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie(process.env.SESSION_NAME || "fw.sid");
      return res.redirect("/auth/login");
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  showLogin,
  showRegister,
  postRegister,
  postLogin,
  postLogout
};

