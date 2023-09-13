<template>
    <view class="bg-primary">
        <view style="padding: 30rpx 30rpx">
            <view class="u-flex">
                <view @click="uploadAvatar">
                    <u-avatar v-if="user.avatar!=null" :src="avatar" mode="square" />
                    <u-avatar v-else mode="square" />
                </view>
                <view style="padding-left: 20rpx;">
                    <view style="font-size: 32rpx;margin-bottom: 4rpx;font-weight: bold;">
                        <text>{{ user?.name }} </text>
                        <u-tag v-if="user?.role?.level!=5" :text="user?.role?.name" type="primary" size="small" style="margin-left: 20rpx;" />
                    </view>
                    <view style="font-size: 24rpx;">{{ user?.department?.name }}</view>
                </view>
                <view>
                    
                </view>
            </view>
        </view>
    </view>
    <view>
        <u-cell-group style="margin-bottom: 30rpx;">
            <u-cell-item @click="showToast()" icon="setting-fill" title="修改密码" />
            <u-cell-item @click="uploadSign" icon="edit-pen-fill" title="设置签名" />
            <u-cell-item @click="showToast2()" icon="question-circle-fill" title="帮助" />
        </u-cell-group>
    </view>
    <view class="container" style="padding-top:20rpx">
         <u-button @click="logOff" type="error" size="medium" style="width: 100%;box-sizing: border-box;" >退出登录</u-button>
    </view>
</template>


<script setup lang="ts">
import API from '@/api';
import type {ChangepasswordResult, UserViewModel} from '@/api/admin/gen/typings'
import {Setting} from '@/config/setting'
import { computed,ref } from 'vue';

const user  = ref<UserViewModel>(uni.getStorageSync("user") as UserViewModel);
const showToast = () => {

    uni.navigateTo({url:'/pages/pwd'})
}

const showToast2 = () => {

    uni.navigateTo({url:'/pages/help'})
}

// computed
const avatar = computed(() => {
    return `${Setting.admin_app_api_base_url}/upload/${user?.value.avatar}`;
});

const uploadAvatar = async()=>{
    const token = uni.getStorageSync("token")?.token;
    uni.chooseImage({
        count:1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album','camera'], //从相册选择
        success: function (res) {
            uni.uploadFile({
			    url: Setting.admin_app_upload_url+'/api/User/ChangeAvatar',
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData: {
                    'user': 'test'
                },
                header:{
                    Authorization: "Bearer " + token 
                },
                success:(uploadFileRes:any) => {
                   if (uploadFileRes.statusCode==200){
                        user.value.avatar = JSON.parse(uploadFileRes.data).message;
                        uni.setStorageSync("user", {...user.value});
                        user.value = uni.getStorageSync("user") as UserViewModel;
                   }
                },
            });
        }
    });
}

const uploadSign = async()=>{
    const token = uni.getStorageSync("token")?.token;
    uni.chooseImage({
        count:1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album','camera'], //从相册选择
        success: function (res) {
            uni.uploadFile({
			    url: Setting.admin_app_upload_url+'/api/User/ChangeSign',
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData: {
                    'user': 'test'
                },
                header:{
                    Authorization: "Bearer " + token 
                },
                success:(uploadFileRes:any) => {
                   if (uploadFileRes.statusCode==200){
                        user.value.signImg = JSON.parse(uploadFileRes.data).message;
                        uni.setStorageSync("user", {...user.value});
                        user.value = uni.getStorageSync("user") as UserViewModel;
                   }
                },
            });
        }
    });
}

const logOff = () => {
    uni.showModal({
        title: '提示',
        content: '确定退出登录吗？',
        success: (res:any) => {
            if (res.confirm) {
                uni.removeStorageSync('token');
                uni.removeStorageSync('user');
                uni.removeStorageSync('check');
                uni.removeStorageSync('donners');
                uni.redirectTo({
                    url: '/pages/login',
                });
            }
        },
    });
};
</script>