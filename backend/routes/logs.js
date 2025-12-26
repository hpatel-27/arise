const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { requireAdmin } = require("../middleware/adminMiddleware");

// Get all logs (admin only)
router.get("/", requireAdmin, logController.getAllLogs);

// Get all logs for a specific user (admin only)
router.get("/user/:userId", requireAdmin, logController.getUserLogs);

// Get a specific log by id for a user (admin only)
router.get("/user/:userId/:logId", requireAdmin, logController.getUserLog);

// Get a specific log by id (admin only)
router.get("/:logId", requireAdmin, logController.getLogById);

module.exports = router;
