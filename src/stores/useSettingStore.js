import { acceptHMRUpdate, defineStore } from "pinia";

export const useSettingStore = defineStore("settingStore", {
  state: () => ({
    limitTask: { enableLimitsTask: false, limitsTask: 20 },
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
