const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { authenticate } = require("../middleware/authMiddleware");

// Get all logs
router.get("/", authenticate, logController.getAllLogs);

// Get a specific log by id
router.get("/:logId", authenticate, logController.getLogById);

// Get all logs for a user
router.get("/:userId", authenticate, logController.getUserLogs);

// Get a specific log by id
router.get("/:userId/:logId", authenticate, logController.getUserLog);

module.exports = router;
