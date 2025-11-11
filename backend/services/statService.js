const prisma = require("../db");

// Constants
const XP_PER_LEVEL = 1000;

// helper function to translate a categoryId to its name
const translateCategory = (categoryId) => {
  const categories = {
    1: "Strength",
    2: "Agility",
    3: "Intelligence",
    4: "Vitality",
    5: "Perception",
  };

  return categories[categoryId];
};

async function initializeStats(userId) {
  const categories = await prisma.category.findMany();

  // Set the user's stats to 10, with 0 XP for each stat
  const userStats = await prisma.userStat.createMany({
    data: categories.map((cat) => ({
      userId: userId,
      categoryId: cat.id,
      statLevel: 10,
      currentXP: 0,
    })),
  });
  // returns a count of how many creates were performed
  return userStats;
}

async function getStats(userId) {
  // Theres only going to be 5 items, due to there being 5 categories
  const stats = [];
  const existingStats = await prisma.userStat.findMany({
    where: { userId },
  });

  existingStats.map((stat) =>
    stats.push({
      category: translateCategory(stat.categoryId),
      currentXP: stat.currentXP,
      statLevel: stat.statLevel,
    })
  );
  return stats;
}

async function getStatByCategory(userId, categoryId) {
  const stat = await prisma.userStat({ where: { userId, categoryId } });
  return stat;
}

async function updateStats(userId, categoryId, xpEarned) {
  const stat = await prisma.userStat.findFirst({
    where: { userId, categoryId },
  });

  let currentXP = stat.currentXP;
  let currentLevel = stat.statLevel;

  // add xp
  currentXP += xpEarned;

  // calculate level ups
  let levelsGained = Math.floor(currentXp / XP_PER_LEVEL);
  currentLevel += levelsGained;

  // Remainder xp after leveling up
  currentXP = currentXP % XP_PER_LEVEL;

  return await prisma.userStat.update({
    where: { id: stat.id },
    data: {
      currentXP: currentXP,
      statLevel: currentLevel,
    },
  });
}

module.exports = {
  initializeStats,
  getStats,
  getStatByCategory,
  updateStats,
};
