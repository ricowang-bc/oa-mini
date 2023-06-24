<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";



onLaunch(() => {
    var token = uni.getStorageSync("token");
    if (!token){
        uni.showToast({
            title: "登录过期请重新登录!",
            icon: "none",
        });
        uni.redirectTo({url:'/pages/login'});
    }
    if (token) {
        var now = new Date().getTime();
        var expire = token.expiration;
        if(expire<now){
            uni.showToast({
                title: "登录过期请重新登录!",
                icon: "none",
            });
            uni.redirectTo({url:'/pages/login'});
        }
    }
});
onHide(() => {
    // console.log("App Hide");
});
</script>

<style lang="scss">
    @import "./uni_modules/vk-uview-ui/index.scss";
</style>