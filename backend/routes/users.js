const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

// Get all users (for admin only)
router.get("/", requireAdmin, userController.getAllUsers);
// Get the current user's information
router.get("/me", authenticate, userController.getUserById);
// Delete the current user
router.delete("/me", authenticate, userController.deleteUser);
// Update the current user
router.patch("/me", authenticate, userController.updateUser);

module.exports = router;
