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
    setUser() {
      const token = localStorage.getItem("token");
      const payload = parseJwt(token);
      this.user.role = payload.role;
      this.user.name = payload.name;
      this.user.oid = payload.oid;
      this.user.email = payload.email;
      this.user.sub = payload.sub;
      this.user.iss = payload.iss;
      this.user.iat = payload.iat;
      this.user.exp = payload.exp;
    },
    getUser() {
      return this.user;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
