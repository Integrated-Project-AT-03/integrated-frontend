class TaskMannagement {
  constructor() {
    this.tasks = [];
  }
  async setTasks(tasks = []) {
    const format = tasks.map((task) => {
      return { ...task, status: task.status.replace("_", " ") };
    });
    this.tasks = format;
  }
  getTasks() {
    return this.tasks;
  }
}

export default new TaskMannagement();
