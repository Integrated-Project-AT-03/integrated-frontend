class TaskMannagement {
  constructor() {
    this.tasks = [];
  }

  async setTasks(tasks = []) {
    const format = tasks.map((task) => task);
    this.tasks = format;
  }
  addTask(task) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }
  findTaskIndex(id) {
    return this.tasks.findIndex((task) => +task.id === +id);
  }
  updateTask(id, newTask) {
    const taskIndex = this.findTaskIndex(id);
    this.tasks[taskIndex] = newTask;
  }
  deleteTask(id) {
    const taskIndex = this.findTaskIndex(id);
    this.tasks.splice(taskIndex, 1);
  }
  findTask(id) {
    return this.tasks.find((task) => +task.id === +id);
  }
}

export default new TaskMannagement();
