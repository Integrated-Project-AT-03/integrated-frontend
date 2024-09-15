import { acceptHMRUpdate, defineStore } from "pinia";

export const useTokenStore = defineStore("tokenStore", {
  state: () => ({
    tokens: {},
  }),

  actions: {
    getToken() {
      console.log(this.tokens);
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTokenStore, import.meta.hot));
}
