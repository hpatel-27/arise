const prisma = require("../db");

async function getAllAchievements() {
  const achievements = await prisma.achievement.findMany({
    select: { id: true },
  });
  return achievements;
}

module.exports = { getAllAchievements };
