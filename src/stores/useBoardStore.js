import { acceptHMRUpdate, defineStore } from "pinia";

export const useBoardStore = defineStore("boardStore", {
  state: () => ({
    boards: [],
    currentBoard: null,
  }),

  actions: {
    setBoards(boards) {
      this.boards = boards;
    },
    addBoard(board) {
      this.boards.push(board);
    },
    getBoards() {
      return this.boards;
    },
    getBoardByNanoId(nanoId) {
      return this.boards.find((board) => board.nanoIdBoard === nanoId);
    },
    findBoardsIndex(id) {
      return this.boards.findIndex((board) => +board.id === +id);
    },
    updateBoard(id, newBoard) {
      const boardIndex = this.findBoardsIndex(id);
      if (boardIndex !== -1) {
        this.boards[boardIndex] = newBoard;
      }
    },
    deleteBoard(id) {
      const boardIndex = this.findBoardsIndex(id);
      if (boardIndex !== -1) {
        this.boards.splice(boardIndex, 1);
      }
    },
    findBoard(id) {
      return this.boards.find((board) => +board.id === +id);
    },
    setCurrentBoard(board) {
      this.currentBoard = board;
    },
    getCurrentBoard() {
      return this.currentBoard;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
