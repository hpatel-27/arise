const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Get all categories
router.get("/categories", categoryController.getAllCategories);

// Get a single category by ID
router.get("/categories/:id", categoryController.getCategoryById);

// Create a new category
router.post("/categories", categoryController.createCategory);

// Update a category by ID
router.patch("/categories/:id", categoryController.updateCategory);

// Delete a category by ID
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
