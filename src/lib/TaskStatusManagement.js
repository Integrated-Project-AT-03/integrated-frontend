class TaskStatusManagement {
  constructor() {
    this.tasks = []
  }

  async setTasks(tasks = []) {
    const format = tasks.map((task) => this._format(task))
    this.tasks = format
  }
  addTask(task) {
    this.tasks.push(this._format(task))
  }

  getTasks() {
    return this.tasks
  }
  findTaskIndex(id) {
    return this.tasks.findIndex((task) => +task.id === +id)
  }
  updateTask(id, newTask) {
    const taskIndex = this.findTaskIndex(id)
    this.tasks[taskIndex] = this._format(newTask)
  }
  deleteTask(id) {
    const taskIndex = this.findTaskIndex(id)
    this.tasks.splice(taskIndex, 1)
  }
  findTask(id) {
    return this.tasks.find((task) => +task.id === +id)
  }

  _format(task) {
    return {
      id: task.id,
      title: task.title,
      assignees: task.assignees,
      status: task.status
        .toLowerCase()
        .replace("_", " ")
        .split(" ")
        .map((word = "") => word[0].toUpperCase() + word.slice(1, word.length))
        .join(" ")
    }
  }
}

export default new TaskStatusManagement()
