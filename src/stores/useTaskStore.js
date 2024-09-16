import { acceptHMRUpdate, defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tasks: [],
  }),

  actions: {
    setTasks(tasks) {
      this.tasks = tasks;
    },
    addTask(task) {
      this.tasks.push(task);
    },
    getTasks() {
      return this.tasks;
    },
    findTaskIndex(id) {
      return this.tasks.findIndex((task) => +task.id === +id);
    },
    updateTask(id, newTask) {
      const taskIndex = this.findTaskIndex(id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = newTask;
      }
    },
    deleteTask(id) {
      const taskIndex = this.findTaskIndex(id);
      if (taskIndex !== -1) {
        this.tasks.splice(taskIndex, 1);
      }
    },
    findTask(id) {
      return this.tasks.find((task) => +task.id === +id);
    },
    changeIdStatusOfTask(oldStatusName, newStatusName) {
      this.tasks.map((task) => {
        if (task.status === oldStatusName) task.status = newStatusName;
        return task;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot));
}
