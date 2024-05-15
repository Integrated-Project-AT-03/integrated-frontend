import { getItems } from "@/assets/fetch";
class ColorsStore {
  colors = [];
  constructor() {}
  async loadColors() {
    this.colors = (
      await getItems(`${import.meta.env.VITE_SERVER_URI}/v2/colors`)
    ).items;
  }
  getColors() {
    return this.colors;
  }
}
const colorsStore = new ColorsStore();
colorsStore.loadColors();
export default colorsStore;
