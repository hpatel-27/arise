const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");

// Get all achievements
router.get("/", achievementController.getAllAchievements);
// Get a single achievement by ID
router.get("/:id", achievementController.getAchievementById);
// Create a new achievement
router.post("/", achievementController.createAchievement);
// Update an achievement by ID
router.patch("/:id", achievementController.updateAchievement);
// Delete an achievement by ID
router.delete("/:id", achievementController.deleteAchievement);

module.exports = router;
