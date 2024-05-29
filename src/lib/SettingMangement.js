class SettingMangement {
  constructor() {
    this.settingLimitTask = { value: null, enable: null };
  }
  setLimitTask(settingLimt) {
    this.settingLimitTask = { ...settingLimt };
  }
  getSettingLimitTask() {
    return this.settingLimitTask;
  }
}

export default new SettingMangement();
