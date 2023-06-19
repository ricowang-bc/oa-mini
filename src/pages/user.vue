<template>
    <view class="bg-primary">
        <view style="padding: 30rpx 30rpx">
            <view class="u-flex">
                <u-avatar :src="avatar" mode="square" />
                <view style="padding-left: 20rpx;">
                    <view style="font-size: 32rpx;margin-bottom: 4rpx;font-weight: bold;">
                        <text>{{ user?.name }} </text>
                        <u-tag :text="user?.role?.name" type="primary" size="small" style="margin-left: 20rpx;" />
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
            <u-cell-item icon="edit-pen-fill" title="设置签名" />
            <u-cell-item icon="question-circle-fill" title="帮助" />
        </u-cell-group>
    </view>
    <view class="container">
         <u-button @click="logOff" type="error" size="medium" style="width: 100%;box-sizing: border-box;" >退出登录</u-button>
    </view>
</template>


<script setup lang="ts">
import type {UserViewModel} from '@/api/admin/gen/typings'
import {Setting} from '@/config/setting'
import { computed } from 'vue';

const user : UserViewModel = uni.getStorageSync("user") as UserViewModel;
const showToast = () => {
    uni.showToast({
        title: '请联系管理员修改密码 !',
        icon: 'none',
    })
}

// computed
const avatar = computed(() => {
    return `${Setting.admin_app_upload_url}/${user?.avatar}`;
});

const logOff = () => {
    uni.showModal({
        title: '提示',
        content: '确定退出登录吗？',
        success: (res:any) => {
            if (res.confirm) {
                uni.removeStorageSync('token');
                uni.removeStorageSync('user');
                uni.reLaunch({
                    url: '/pages/login',
                });
            }
        },
    });
};

</script>