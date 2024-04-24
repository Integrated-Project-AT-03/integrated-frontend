import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
} from "./../assets/fetch.js";

const uri = import.meta.env.VITE_SERVER_URI;

class TaskMannagement {
  constructor() {
    this.tasks = [];
  }

  async fetchTasks() {
    this.tasks = await getItems(`${uri}/v1/tasks`);
  }

  async fetchTaskById(id){
    const taskById = await getItemById(`${uri}/v1/tasks/${id}`)
    return taskById
  }
  getTasks() {
    return this.tasks;
  }
}

export default new TaskMannagement();
