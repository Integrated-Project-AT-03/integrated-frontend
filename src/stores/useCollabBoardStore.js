import { acceptHMRUpdate, defineStore } from "pinia";

export const useCollabBoardStore = defineStore("collabBoardStore", {
  state: () => ({
    collabsBoard: [],
  }),

  actions: {
    setCollabsBoard(collabsBoard) {
      this.collabsBoard = collabsBoard; 
    },
    getCollabsBoard() {
      return this.collabsBoard;
    },
    findCollabsBoardIndex(nanoId) {
      return this.collabsBoard.findIndex((collab) => collab.boardNanoId === nanoId);
    },
    deleteCollabBoard(id) {
      const collabBoardIndex = this.findCollabsBoardIndex(id);
      if (collabBoardIndex !== -1) {
        this.collabsBoard.splice(collabBoardIndex, 1);
      }
    },
  },
//   getters: {
//     collabsBoards: (state) => {
//         return state.collabsBoard
//     }
//   }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCollabBoardStore, import.meta.hot));
}
