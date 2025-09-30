const achievementService = require("../services/achievementService");
const pickFields = require("../utils/pickFields");

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

async function getAchievementById(req, res) {
  console.log("Fetching achievement with ID:", req.params.id);
  try {
    const achievement = await achievementService.getAchievementById(
      req.params.id
    );
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateAchievement(req, res) {
  console.log("Updating achievement with ID:", req.params.id);
  try {
    const data = pickFields(req.body, [
      "name",
      "description",
      "iconPath",
      "category",
    ]);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const achievement = await achievementService.updateAchievement(
      req.params.id,
      data
    );

    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteAchievement(req, res) {
  console.log("Deleting achievement with ID:", req.params.id);
  try {
    const achievement = await achievementService.deleteAchievement(
      req.params.id
    );
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllAchievements,
  createAchievement,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
};
