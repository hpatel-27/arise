import express from "express";
const router = express.Router();
const achievementController = require("../controllers/achievementController");

// Get all achievements
router.get("/achievements", achievementController.getAllAchievements);
// Get a single achievement by ID
router.get("/achievements/:id", achievementController.getAchievementById);
// Update an achievement by ID
router.patch("/achievements/:id", achievementController.updateAchievement);
// Create a new achievement
router.post("/achievements", achievementController.createAchievement);

module.exports = router;
