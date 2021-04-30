const TaskController = require('./src/controllers/task');

module.exports = {
  create: TaskController.createTask,
  list: TaskController.getAllTasks,
  get: TaskController.getTaskById,
  update: TaskController.updateTaskById,
  delete: TaskController.deleteTaskById,
};
