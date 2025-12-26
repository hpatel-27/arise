const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

// Get all categories
router.get("/", authenticate, categoryController.getAllCategories);

// Get a single category by ID
router.get("/:id", authenticate, categoryController.getCategoryById);

// Create a new category (admin only)
router.post("/", requireAdmin, categoryController.createCategory);

// Update a category by ID (admin only)
router.patch("/:id", requireAdmin, categoryController.updateCategory);

// Delete a category by ID (admin only)
router.delete("/:id", requireAdmin, categoryController.deleteCategory);

module.exports = router;
