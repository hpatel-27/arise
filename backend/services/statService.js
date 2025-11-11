const prisma = require("../db");

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
    where: { userId: userId },
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

module.exports = {
  initializeStats,
  getStats,
};
