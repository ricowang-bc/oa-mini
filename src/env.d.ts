/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module "vk-uview-ui" {
    import uView from "./uni_modules/vk-uview-ui"
    export default uView
}


declare const uni :UniNamespace.Uni & {
    $u: any
}