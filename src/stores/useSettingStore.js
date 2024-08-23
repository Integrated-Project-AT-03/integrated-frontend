import { acceptHMRUpdate, defineStore } from "pinia";

export const useSettingStore = defineStore("settingStore", {
  state: () => ({
    limitTask: { enable: false, value: 10 },
  }),

  actions: {
    setLimitTask(setting) {
      this.limitTask = { enable: setting.enable, value: setting.value };
      console.log(this.limitTask);
    },
    getLimitTask() {
      return this.limitTask;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
