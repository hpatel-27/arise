const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

// Get all users (for testing purposes)
router.get("/", userController.getAllUsers);
// Get a single user by ID
router.get("/me", authenticate, userController.getUserById);
// Delete a user by ID
router.delete("/me", authenticate, userController.deleteUser);
// Update a user by ID
router.patch("/me", authenticate, userController.updateUser);

module.exports = router;
