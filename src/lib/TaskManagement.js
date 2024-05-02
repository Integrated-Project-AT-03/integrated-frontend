class TaskMannagement {
  constructor() {
    this.tasks = []
  }

  async setTasks(tasks = []) {
    const format = tasks.map((task) => this.format(task))
    this.tasks = format
  }
  addTask(task) {
    this.tasks.push(this.format(task))
  }

  getTasks() {
    return this.tasks
  }
  format(task) {
    return {
      ...task,
      status: task.status
        .toLowerCase()
        .replace("_", " ")
        .split(" ")
        .map((word = "") => word[0].toUpperCase() + word.slice(1, word.length))
        .join(" ")
    }
  }
}

export default new TaskMannagement()
