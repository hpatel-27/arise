function taskDTO(task) {
  return {
    id: task.id,
    categoryId: task.categoryId,
    name: task.name,
    requirement: task.requirement,
    xpValue: task.xpValue,
  };
}

module.exports = { taskDTO };
