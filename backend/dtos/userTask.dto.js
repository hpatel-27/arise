function userTaskDTO(userTask) {
  return {
    id: userTask.id,
    taskId: userTask.taskId,
    progress: userTask.progress,
    isActive: userTask.isActive,
    updatedAt: userTask.updatedAt,
  };
}

module.exports = { userTaskDTO };
