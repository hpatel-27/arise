function achievementDTO(achievement) {
  return {
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    iconPath: achievement.iconPath,
    category: achievement.category,
  };
}

module.exports = { achievementDTO };
