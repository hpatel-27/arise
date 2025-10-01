const prisma = require("../db");

async function getAllAchievements() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { id: "asc" },
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

async function deleteAchievement(id) {
  // may throw error if achievement with given id does not exist
  const achievement = await prisma.achievement.delete({
    where: { id: parseInt(id, 10) },
  });
  // return the deleted achievement
  return achievement;
}

module.exports = {
  getAllAchievements,
  createAchievement,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
};
