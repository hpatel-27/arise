function achievementDTO(achievement) {
  return {
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    iconPath: achievement.iconPath,
    category: achievement.category,
    targetValue: achievement.targetValue ?? null,
    progress: achievement.progress ?? 0,
    unlocked: achievement.unlocked ?? false,
    dateUnlocked: achievement.dateUnlocked ?? null,
  };
}

module.exports = { achievementDTO };
