const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");

router.get("/achievements", achievementController.getAllAchievements);

module.exports = router;
