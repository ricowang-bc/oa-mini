<template>
    <u-cell-group>
		<u-cell-item title="申请车辆" @click="show = true" :value="car"/>
		<u-cell-item title="用车时间" @click="showCalendar=true"></u-cell-item>
        <view style="padding:20rpx 30rpx" class="u-flex u-row-between">
            <view style="font-size: 24rx;color: #909399;" v-if="duration.length>0">{{ durationDates[0] }} 至 {{ durationDates[duration.length-1] }}</view>
            <view style="font-size: 24rx;color: #909399;">共 {{ duration.length }} 天</view>
        </view>
	</u-cell-group>
    <u-card title="用车事由" margin="30rpx 0" :body-style="{padding:'30rpx'}">
        <template #body>
            <u-input v-model="request.remark" type="textarea" :border="true" placeholder="请填写用车事由" />
        </template>
    </u-card>
    <u-picker v-model="show" mode="selector" :range="carNumbers" @confirm="onConfirmCar"> </u-picker>
    <u-calendar v-model="showCalendar" mode="range" @change="onChangeDays" :safe-area-inset-bottom="true" max-date="2050-12-31" />
    <view class="container" style="padding-top:20rpx">
         <u-button @click="Save" type="primary" size="medium" style="width: 100%;box-sizing: border-box;" >提交申请</u-button>
    </view>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type{   Car,  CreateCheViewModel } from '@/api/admin/gen/typings';
import API from '@/api';
import { onShow } from '@dcloudio/uni-app';

import dayjs from 'dayjs'

const car = computed(() => {
    return cars.value.find(item => item.id == request.value.carID)?.number;
});

const cars = ref<Car[]>([]);
// 计算属性
const carNumbers = computed(() => {
    return  cars.value.map(item => item.number);
});
const show = ref(false);
const showCalendar = ref(false);

const request = ref<CreateCheViewModel>({
    remark:'',
    begin:'',
    finish:'',
});

onShow(async() => {
    try{
        const res = await API.Car.All();
        if(res){
            cars.value = res;
        }
        console.log(carNumbers);
    }catch(e){
        console.log(e);
    }
});
const duration =ref<string[]>([]);
const durationDates =ref<string[]>([]);

const onConfirmCar = (e:any) => {
    
    show.value = false;
    request.value.carID = cars.value[e[0]].id;
    console.log(request.value);
}
const onChangeDays = (e:any) => {
    // 将 字符串 e.startDate 和字符串 e.endDate 转换为 Date 类型
    const startDate = new Date(e.startDate);
    const endDate = new Date(e.endDate);
    // 计算两个日期之间的天数
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    duration.value = [];
    // 遍历 startDate 到 endDate 之间的每一天，将每一天的日期转换为字符串，然后用逗号拼接起来
    for (let i = 0; i < days+1; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        duration.value.push(date.toLocaleDateString());
         durationDates.value.push(dayjs(date).format('YYYY年MM月DD日'));
    }
    request.value.begin = e.startDate;
    request.value.finish = e.endDate;
    showCalendar.value = false;
}


const Save = async () => {

    if ( !request.value.carID ) {
        uni.showToast({
            title: '请选择车辆',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    if (!duration.value|| duration.value.length == 0) {
        uni.showToast({
            title: '请选择用车时间',
            icon: 'none',
            duration: 2000
        });
        return;
    }

    if ( !request.value.remark || request.value.remark?.length == 0) {
        uni.showToast({
            title: '请填写用车事由',
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
        const res = await API.Che.Post(request.value);
        if(res){
            uni.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            });
            uni.redirectTo({
                url: `/pages/check/index?id=${res.id}&prefix=FLYC&type=2`,
            });
        }
    }catch(e){
        console.log(e);
    }finally{
        uni.hideLoading();
    }
}
</script>