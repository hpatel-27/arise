import achievementService from "../services/achievementService";

async function getAllAchievements(req, res) {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createAchievement(req, res) {
  console.log("Creating achievement with data:", req.body);
  try {
    const data = {
      name: req.body.name,
      description: req.body.description,
      iconPath: req.body.iconPath,
      category: req.body.category,
    };

    const achievement = await achievementService.createAchievement(data);
    res.status(201).json(achievement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllAchievements, createAchievement };
