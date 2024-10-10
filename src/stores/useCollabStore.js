import { acceptHMRUpdate, defineStore } from "pinia";

export const useCollabStore = defineStore("collabStore", {
  state: () => ({
    collabs: [],
  }),

  actions: {
    setCollabs(collabs) {
      this.collabs = collabs; 
    },
    addCollab(collab) {
      this.collabs.push(collab);
    },
    getCollabs() {
      return this.collabs;
    },
    getCollabByNanoId(nanoId) {
      return this.collabs.find((collab) => collab.oid === nanoId);
    },
    findCollabsIndex(oid) {
      return this.collabs.findIndex((collab) => collab.oid === oid);
    },
    deleteCollab(id) {
      const collabIndex = this.findCollabsIndex(id);
      if (collabIndex !== -1) {
        this.collabs.splice(collabIndex, 1);
      }
    },
    updateCollab(oid, newAccessRight) {
      const collabIndex = this.findCollabsIndex(oid);
      if (collabIndex !== -1) {
        this.collabs[collabIndex].accessRight = newAccessRight;
      }
    },
    findCollab(id) {
      return this.collabs.find((collab) => +collab === +id);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCollabStore, import.meta.hot));
}
