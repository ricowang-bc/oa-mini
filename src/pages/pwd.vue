<template>
    <u-cell-group style="margin-bottom: 30rpx;">
        <u-cell-item title="旧密码" :arrow="false" >
            <template #right-icon>
                <u-input type="password" v-model="request.oldPwd"  placeholder="请输入当前密码" />
            </template>
        </u-cell-item>
        <u-cell-item title="新密码" :arrow="false" >
            <template #right-icon>
                <u-input type="password" v-model="request.newPwd"  placeholder="请输入新密码" />
            </template>
        </u-cell-item>
        <u-cell-item title="确认密码" :arrow="false" >
            <template #right-icon>
                <u-input  type="password" v-model="pwd2" placeholder="请再次输入新密码" />
            </template>
        </u-cell-item>
    </u-cell-group>  
    <view class="container" style="padding-top:20rpx">
         <u-button @click="ChangePwd" type="primary" size="medium" style="width: 100%;box-sizing: border-box;" >确定</u-button>
    </view>
</template>
<script setup lang="ts">

import type { ChangepasswordModel,UserViewModel,ChangepasswordResult} from '@/api/admin/gen/typings'
import { ref } from 'vue';
import API from '@/api'

const request = ref<ChangepasswordModel>({id:undefined,oldPwd:undefined,newPwd:undefined});
const user : UserViewModel = uni.getStorageSync("user") as UserViewModel;
const pwd2= ref<string>();

const ChangePwd = async () => {
    if (request.value?.oldPwd?.trim() != user.password ){
        uni.showToast({
            title:'当前密码错误',
            duration:2000,
            icon:'none'
        })
        return;
    }
    if (request.value?.newPwd?.trim() == user.password ){
        uni.showToast({
            title:'新密码不能与当前密码一致',
            duration:2000,
            icon:'none'
        });
        return;
    }
    if (!pwd2.value || pwd2.value.trim()=='' || pwd2.value.trim()==undefined){
        uni.showToast({
            title:'请确认新密码',
            duration:2000,
            icon:'none'
        })
        return;
    }
    if (request.value?.newPwd?.trim() != pwd2.value.trim() ){
        uni.showToast({
            title:'两次输入的密码不一致',
            duration:2000,
            icon:'none'
        })
        return;
    }

   
    try{
        request.value.id = user.id;
        let res = await API.User.ChangePassword(request.value);
        uni.showToast({
            title:res.message,
            duration:2000,
            icon:'none'
        })
        if (res.status==true){
           setTimeout(()=>{
                uni.clearStorageSync();
                uni.reLaunch({url:'/pages/login'});
           },2000);
        }
    }catch(err:any){
        console.log(err);
    }
}

</script>