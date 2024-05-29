class TaskStatusManagement {
  constructor() {
    this.statuses = [];
  }
  setStatuses(statuses = []) {
    this.statuses = statuses;
  }
  addStatus(status) {
    this.statuses.push(status);
  }

  getStatuses() {
    return this.statuses;
  }
  getStatusesByName(name) {
    return this.statuses.filter((status) =>
      status.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  findStatusIndex(id) {
    return this.statuses.findIndex((status) => +status.id === +id);
  }
  updateStatus(id, newStatus) {
    const statusIndex = this.findStatusIndex(id);
    this.statuses[statusIndex] = newStatus;
  }
  deleteStatus(id) {
    const statusIndex = this.findStatusIndex(id);
    this.statuses.splice(statusIndex, 1);
  }
  findStatus(id) {
    return this.statuses.find((status) => +status.id === +id);
  }
}

export default new TaskStatusManagement();
