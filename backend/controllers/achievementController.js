const achievementService = require("../services/achievementService");

async function getAllAchievements(req, res) {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllAchievements };
