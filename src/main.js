import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
const options = {};
const pinia = createPinia();
const app = createApp(App);
app.use(Toast, options);
app.use(pinia);
app.use(router);

app.mount("#app");
