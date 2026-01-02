function userStatDTO(userStat) {
  return {
    id: userStat.id,
    category: userStat.category,
    currentXP: userStat.currentXP,
    statLevel: userStat.statLevel,
  };
}

module.exports = { userStatDTO };
