<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";




onLaunch(() => {
    const token = uni.getStorageSync("token");

    if (!token) {
        uni.showToast({
            title: "登录过期请重新登录!",
            icon: "none",
        });
        uni.redirectTo({
            url: "/pages/login",
        });
    }
});
onShow(() => {
    // console.log("App Show");
});
onHide(() => {
    // console.log("App Hide");
});
</script>

<style lang="scss">
    @import "./uni_modules/vk-uview-ui/index.scss";
</style>
