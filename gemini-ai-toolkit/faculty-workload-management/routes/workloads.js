const express = require("express");

const { requireAuth } = require("../middleware/auth");
const workloadController = require("../controllers/workloadController");

const router = express.Router();

router.get("/", requireAuth, workloadController.listWorkloads);
router.get("/new", requireAuth, workloadController.showCreate);
router.post("/", requireAuth, workloadController.createWorkload);
router.get("/:id/edit", requireAuth, workloadController.showEdit);
router.put("/:id", requireAuth, workloadController.updateWorkload);
router.delete("/:id", requireAuth, workloadController.deleteWorkload);

module.exports = router;

