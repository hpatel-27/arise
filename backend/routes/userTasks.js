const express = require("express");
const router = express.Router();
const userTaskController = require("../controllers/userTaskController");
const { authenticate } = require("../middleware/authMiddleware");

// Assign a Task to the User
router.post(
  "/userTasks/:taskId/assign",
  authenticate,
  userTaskController.assignTask
);

// Complete a Task for the User
router.post(
  "/userTasks/:taskId/complete",
  authenticate,
  userTaskController.completeTask
);

module.exports = router;
