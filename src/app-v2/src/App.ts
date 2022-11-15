import { createApp } from "vue";
// Vue Router
import { createPinia } from "pinia";
import router from "./router";

import { registerStore } from "./store";
import App from "@/App.vue";

import "@/style/tailwind.css";
import "@/style/main.scss";

const app = createApp(App);

app.use(createPinia());
registerStore();

app.use(router);

app.mount("#app");
