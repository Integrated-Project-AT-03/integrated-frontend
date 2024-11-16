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
    isAuthenticated: false,
  }),

  actions: {
    setUser(user) {
    this.user = user
    },
    getUser() {
      return this.user;
    },
    setIsAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    }
  },
  getters: {
    isAuthenticated: state => state
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
