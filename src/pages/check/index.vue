

<template>
    <view class="check">
        <view class="check-item">
            <view class="u-flex flex-row-bewteen" style="justify-content: space-between;">
                <view class="u-card__head--left u-flex u-line-1 ">
                    <u-avatar mode="square" size="mini"></u-avatar>
                    <text style="font-size:28rpx;color:#909399;margin-left: 20rpx;"> {{ flow.creatorName  }}的{{flow.prefix }}</text>
                </view>
                <view v-if="flow.status!=undefined">
                    <u-tag   size="small" :type="getStatus(flow.status).type" :text="getStatus(flow.status).text" />
                </view>
            </view>
        </view>
        <meet-item :flow="flow" />
        <view class="bottom-fix">
            <view style="padding-bottom:20rpx;border-bottom:1rpx solid #ddd">
                <u-input  :border="true" placeholder="填写意见"/>
            </view>
            <view class="u-flex row-end" style="padding-top:20rpx" v-if="flow.prefix!='会议纪要'">
                <u-button type="error" size="medium" style="margin-right: 20rpx;">驳回</u-button>
                <u-button type="primary" size="medium">同意</u-button>
            </view>
            <view class="u-flex row-end" style="padding-top:20rpx" v-else>
                <u-button type="primary" size="medium">签字</u-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type {  WorkViewModel, } from '@/api/admin/gen/typings';
import MeetItem from './components/huiyi.vue'
const flow = ref<WorkViewModel>({} as WorkViewModel);
onLoad(() => {
    let check = uni.getStorageSync('check');
    flow.value = {...check};
    // uni.removeStorageSync('check');
});


const getStatus = (status:any)=>{
    if (status == 0 || !status){
        return {
            text:'待审批',
            type:'warning'
        };
    }
    if (status == 1){
        return {
            text:'流程中',
            type:'info'
        };
    }
    if (status == 2){
        return {
            text:'审批通过',
            type:'success'
        };
    }
    if (status == 3){
        return {
            text:'被驳回',
            type:'error'
        };
    }
    if (status == 4){
        return {
            text:'已取消',
            type:'error'
        };
    }
     return {
        text:'待审批',
        type:'warning'
    };
}

</script>