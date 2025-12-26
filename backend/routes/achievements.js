const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");
const { requireAdmin } = require("../middleware/adminMiddleware");
const { authenticate } = require("../middleware/authMiddleware");

// Get all achievements
router.get("/", authenticate, achievementController.getAllAchievements);

// Get a single achievement by ID
router.get("/:id", authenticate, achievementController.getAchievementById);

// Create a new achievement (admin only)
router.post("/", requireAdmin, achievementController.createAchievement);

// Update an achievement by ID (admin only)
router.patch("/:id", requireAdmin, achievementController.updateAchievement);

// Delete an achievement by ID (admin only)
router.delete("/:id", requireAdmin, achievementController.deleteAchievement);

module.exports = router;
