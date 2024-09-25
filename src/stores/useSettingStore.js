import { acceptHMRUpdate, defineStore } from "pinia";

export const useSettingStore = defineStore("settingStore", {
  state: () => ({
    limitTask: { enableLimitsTask: false, limitsTask: 20 },
    visibility: "",
  }),

  actions: {
    setLimitTask(setting) {
      this.limitTask = {
        enableLimitsTask: setting.enableLimitsTask,
        limitsTask: setting.limitsTask,
      };
    },
    getLimitTask() {
      return this.limitTask;
    },
    getVisibility() {
      return this.visibility;
    },
    setVisibility(newVisibility) {
      this.visibility = newVisibility;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
