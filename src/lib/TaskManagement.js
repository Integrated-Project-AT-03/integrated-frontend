class TaskMannagement {
  constructor() {
    this.tasks = [];
  }

  async setTasks(tasks = []) {
    const format = tasks.map((task) => {
      return {
        ...task,
        status: task.status
          .toLowerCase()
          .replace("_", " ")
          .split(" ")
          .map(
            (word = "") => word[0].toUpperCase() + word.slice(1, word.length)
          )
          .join(" "),
      };
    });
    this.tasks = format;
  }
  addTask(task) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }
}

export default new TaskMannagement();
