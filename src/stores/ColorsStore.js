import { getColors } from "@/services/apiColor";
class ColorsStore {
  colors = [];
  constructor() {}
  async loadColors() {
    this.colors = (await getColors()).data;
  }
  getColors() {
    return this.colors;
  }
}
const colorsStore = new ColorsStore();
colorsStore.loadColors();
export default colorsStore;
