import { createSSRApp as CA } from "vue"
import App from "./App.vue"

import uView from "./uni_modules/vk-uview-ui/index"

export function createApp() {
    const app = CA(App);
    app.use(uView);
    return {
        app,
    }
}
