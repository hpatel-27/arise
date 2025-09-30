const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users (for testing purposes)
router.get("/users", userController.getAllUsers);
// Get a single user by ID
router.get("/users/:id", userController.getUserById);
// Delete a user by ID
router.delete("/users/:id", userController.deleteUser);
// Update a user by ID
router.patch("/users/:id", userController.updateUser);

module.exports = router;
