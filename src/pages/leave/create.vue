<template>
    <u-cell-group>
		<u-cell-item title="请假类型" @click="show = true" :value="request.type"/>
		<u-cell-item title="请假时间" @click="showCalendar=true"></u-cell-item>
        <view style="padding:20rpx 30rpx" class="u-flex u-row-between">
            <view style="font-size: 24rx;color: #909399;" v-if="duration.length>0">{{ duration[0] }} 至 {{ duration[duration.length-1] }}</view>
            <view style="font-size: 24rx;color: #909399;">共 {{ request.dayCount }} 天</view>
        </view>
	</u-cell-group>
    <u-card title="请假原因" margin="30rpx 0" :body-style="{padding:'30rpx'}">
        <template #body>
            <u-input v-model="request.reason" type="textarea" :border="true" placeholder="请填写请假原因" />
        </template>
    </u-card>
    <u-picker v-model="show" mode="selector" :range="LeaveLables" @confirm="onConfirmLeaveType"> </u-picker>
    <u-calendar v-model="showCalendar" mode="range" @change="onChangeDays" :safe-area-inset-bottom="true" max-date="2050-12-31" />
    <view class="container" style="padding-top:20rpx">
         <u-button @click="Save" type="primary" size="medium" style="width: 100%;box-sizing: border-box;" >提交申请</u-button>
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {  LeaveType, type CreateLeaveViewModel } from '@/api/admin/gen/typings';
import API from '@/api';

const leaves = [
    {index:0,label:'事假',type:LeaveType.事假},
    {index:1,label:'病假',type:LeaveType.病假},
    {index:2,label:'婚假',type:LeaveType.婚假},
    {index:3,label:'产假',type:LeaveType.产假},
    {index:4,label:'丧假',type:LeaveType.丧假},
    {index:5,label:'探亲假',type:LeaveType.探亲假},
    {index:6,label:'年休假',type:LeaveType.年休假},
    {index:7,label:'其他',type:LeaveType.其他},
]
const LeaveLables = leaves.map(item => item.label);
const show = ref(false);
const showCalendar = ref(false);

const request = ref<CreateLeaveViewModel>({
    reason:'',
    dayCount:0,
    days:'',
});

const duration =ref<string[]>([]);

const onConfirmLeaveType = (e:any) => {
    
    request.value.type = leaves[e[0]].type;
    show.value = false;
    console.log(request.value);
}
const onChangeDays = (e:any) => {
    // 将 字符串 e.startDate 和字符串 e.endDate 转换为 Date 类型
    const startDate = new Date(e.startDate);
    const endDate = new Date(e.endDate);
    // 计算两个日期之间的天数
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    request.value.dayCount = days+1;
    duration.value = [];
    // 遍历 startDate 到 endDate 之间的每一天，将每一天的日期转换为字符串，然后用逗号拼接起来
    for (let i = 0; i < days+1; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        duration.value.push(date.toLocaleDateString());
    }
    request.value.days = duration.value.join(',');
    showCalendar.value = false;
}


const Save = async () => {

    if ( !request.value.type ) {
        uni.showToast({
            title: '请选择请假类型',
            icon: 'none',
            duration: 2000
        });
        return;
    }

    if(request.value.dayCount==0){
        uni.showToast({
            title: '请选择请假时间',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    if ( !request.value.reason || request.value.reason?.length == 0) {
        uni.showToast({
            title: '请填写请假原因',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    uni.showLoading({
        title: '提交中...',
        mask: true
    });
    try{
        let payload : any = {...request.value};
        payload.type = leaves.find(item => item.type == request.value.type)?.index;
        const res = await API.Leave.Post(payload);
        if(res){
            uni.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            });
            uni.redirectTo({
                url: `/pages/check/index?id=${res.id}&prefix=FLQJ&type=2`,
            });
        }
    }catch(e){
        console.log(e);
    }finally{
        uni.hideLoading();
    }
}
</script>