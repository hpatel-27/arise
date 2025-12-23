function userTaskCompletionDTO(userTaskCompletion) {
  return {
    id: userTaskCompletion.id,
    userTaskId: userTaskCompletion.userTaskId,
    completedAt: userTaskCompletion.completedAt,
    xpEarned: userTaskCompletion.xpEarned,
  };
}

module.exports = { userTaskCompletionDTO };
