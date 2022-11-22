import { createApp } from "vue";
// Vue Router
import { createPinia } from "pinia";
import router from "./router";

import { registerStore } from "./store";
import App from "./App.vue";
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import "./style/tailwind.css";
import "./style/main.scss";

const app = createApp(App);

app.use(createPinia());
app.use(PerfectScrollbar)
registerStore();

app.use(router);

app.mount("#app");
