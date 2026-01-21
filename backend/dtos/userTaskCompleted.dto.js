function userTaskCompletionDTO(userTaskCompletion) {
  return {
    id: userTaskCompletion.id,
    userTaskId: userTaskCompletion.userTaskId,
    completedAt: userTaskCompletion.completedAt,
    xpEarned: userTaskCompletion.xpEarned,
    statName: userTaskCompletion.statName,
    levelUp: userTaskCompletion.levelUp,
    newLevel: userTaskCompletion.newLevel,
  };
}

module.exports = { userTaskCompletionDTO };
