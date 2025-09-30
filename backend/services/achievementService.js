const prisma = require("../db");

async function getAllAchievements() {
  const achievements = await prisma.achievement.findMany({
    select: { id: true },
  });
  return achievements;
}

async function createAchievement(data) {
  const achievement = await prisma.achievement.create({ data });
  return achievement;
}

async function getAchievementById(id) {
  const achievement = await prisma.achievement.findUnique({
    where: { id: parseInt(id, 10) },
  });
  return achievement;
}

async function updateAchievement(id, data) {
  const achievement = await prisma.achievement.update({
    where: { id: parseInt(id, 10) },
    data,
  });
  return achievement;
}

module.exports = {
  getAllAchievements,
  createAchievement,
  getAchievementById,
  updateAchievement,
};
