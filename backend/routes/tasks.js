const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticate } = require("../middleware/authMiddleware");

// Get all tasks (authenticated users)
router.get("/", authenticate, taskController.getAllTasks);

// Get a specific task by ID
router.get("/:id", authenticate, taskController.getTaskById);

// Create task (authenticated users)
router.post("/", authenticate, taskController.createTask);

// Update a task (authenticated users)
router.patch("/:id", authenticate, taskController.updateTask);

// Delete a task (authenticated users)
router.delete("/:id", authenticate, taskController.deleteTask);

module.exports = router;
