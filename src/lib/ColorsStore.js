import { getItems } from "@/assets/fetch";
class colors {
  colors = [];
  constructor() {}
  async loadColors() {
    this.colors = await getItems(
      `${import.meta.env.VITE_SERVER_URI}/v2/colors`
    );
  }
  getColors() {
    return this.colors;
  }
}
const colorsStore = new colors();
colorsStore.loadColors();
export default colorsStore;
