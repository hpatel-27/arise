const express = require("express");
const router = express.Router();
const userTaskController = require("../controllers/userTaskController");
const { authenticate } = require("../middleware/authMiddleware");

// Get all active tasks for a user
router.get("/", authenticate, userTaskController.getAllActiveTasksForUser);

// Get a task for a user
router.get("/:taskId", authenticate, userTaskController.getTaskForUser);

// Assign a Task to the User
router.post("/:taskId/assign", authenticate, userTaskController.assignTask);

// Complete a Task for the User
router.post("/:taskId/complete", authenticate, userTaskController.completeTask);

module.exports = router;
