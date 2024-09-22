import { acceptHMRUpdate, defineStore } from "pinia";
import { parseJwt } from "../utils/helper";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {
      role: "",
      name: "",
      oid: "",
      email: "",
      sub: "",
      iss: "",
      iat: "",
      exp: "",
    },
  }),

  actions: {
    setUser(user) {
    this.user = user
    },
    getUser() {
      return this.user;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
