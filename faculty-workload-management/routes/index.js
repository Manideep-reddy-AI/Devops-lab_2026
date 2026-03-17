const express = require("express");

const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const workloadRoutes = require("./workloads");
const facultyRoutes = require("./faculty");
const profileRoutes = require("./profile");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session && req.session.userId) return res.redirect("/dashboard");
  return res.redirect("/auth/login");
});

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/workloads", workloadRoutes);
router.use("/faculty", facultyRoutes);
router.use("/profile", profileRoutes);

module.exports = router;

