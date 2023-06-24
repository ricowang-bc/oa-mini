<template>
	<view class="container login">
		<view style="padding-top: 320rpx;box-sizing: border-box;">
			<view class="u-login-logo">
				<u-image  width="120" height="120" src="/static/images/logo2.png" />
                
			</view>
            <view class="u-text-center">邯郸市农业综合行政执法支队</view>
			<u-form >
				<u-form-item label="账号">
					<input border="true" type="text" placeholder="请输入账号" v-model="user.userName" />
				</u-form-item>
				<u-form-item label="密码">
					<input border="true" type="password" placeholder="请输入密码" v-model="user.password" />
				</u-form-item>
                <u-button  style="display: block;margin-top: 30rpx; width: 100%; " type="primary" size="medium" @click="login">登 录</u-button>
			</u-form>
		</view>
		<view class="u-login-footer">© 2022 邯郸市农业综合行政执法支队</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { LoginRequest } from "@/api/admin/gen/typings";
const user = ref<LoginRequest>({ userName: "", password: "1" });
import API from '@/api'

const login =async () => {
	try{
        uni.showLoading({
            title: "登录中...",
        });
        let res : any = await API.Auth.Login(user.value);
        if (res.info && res.token){
            uni.setStorageSync("token", res.token);
            uni.setStorageSync("user", res.info);
            uni.reLaunch({
                url: "/pages/index",
            });
            uni.hideLoading();
        }else{
            uni.showToast({
                title: res.message,
                icon: "none",
            });
        }

    }catch(err:any){
        console.log(err);
        uni.showToast({
            title: err.message,
            icon: "none",
        });
    }
    
};
</script>

<style lang="scss">
// logo  垂直居中，水平居中
.u-login-logo {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 120rpx;
	img {
		width: 120rpx;
		height: 120rpx;
	}
}
.u-login-footer{
    position: absolute;
    bottom: 20rpx;
    font-size: 24rpx;
    color: #999;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
}
</style>
