const { ValidationError } = require('../models/error');

const validateTask = (task) => {
  if (!task.title) {
    throw new ValidationError('No task title', 'NO_TASK_TITLE');
  }

  if (!task.description) {
    task.description = '';
  }

  return task;
}

module.exports = {
  validateTask,
}