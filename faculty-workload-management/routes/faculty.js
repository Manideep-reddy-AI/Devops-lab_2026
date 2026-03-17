const express = require("express");

const { requireAuth, requireRole } = require("../middleware/auth");
const facultyController = require("../controllers/facultyController");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), facultyController.listFaculty);
router.get("/new", requireAuth, requireRole("admin"), facultyController.showCreateFaculty);
router.post("/", requireAuth, requireRole("admin"), facultyController.createFaculty);
router.get("/:id/edit", requireAuth, requireRole("admin"), facultyController.showEditFaculty);
router.put("/:id", requireAuth, requireRole("admin"), facultyController.updateFaculty);
router.delete("/:id", requireAuth, requireRole("admin"), facultyController.deleteFaculty);

module.exports = router;

