function userStatDTO(userStat) {
  return {
    id: userStat.id,
    categoryId: userStat.categoryId,
    currentXP: userStat.currentXP,
    statLevel: userStat.statLevel,
  };
}

module.exports = { userStatDTO };
