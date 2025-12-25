const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");
const { authenticate } = require("../middleware/authMiddleware");

// Get all stats of a user
router.get("/me", authenticate, statController.getStats);

// Get a specific stat by category for a user
router.get("/me/:categoryId", authenticate, statController.getStatByCategory);

module.exports = router;
