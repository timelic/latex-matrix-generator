import { createApp } from "vue";
import App from "./App.vue";
import VueLatex from "vatex";

const app = createApp(App);
app.use(VueLatex);
app.mount("#app");
