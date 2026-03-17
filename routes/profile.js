const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");
const profileController = require("../controllers/profileController");
const { addFlash } = require("../middleware/flash");

const router = express.Router();

router.get("/", requireAuth, profileController.showProfile);
router.post("/", requireAuth, profileController.updateProfile);

router.post("/avatar", requireAuth, (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      addFlash(req, "danger", err.message || "Upload failed.");
      return res.redirect("/profile");
    }
    return next();
  });
}, profileController.updateAvatar);

router.get("/password", requireAuth, profileController.showPassword);
router.post("/password", requireAuth, profileController.changePassword);

module.exports = router;

