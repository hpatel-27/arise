import express from "express";
const router = express.Router();
const achievementController = require("../controllers/achievementController");

router.get("/achievements", achievementController.getAllAchievements);
router.post("/achievements", achievementController.createAchievement);

module.exports = router;
