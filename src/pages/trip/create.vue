<template>
    <u-cell-group>
		<u-cell-item title="出差时间" @click="showCalendar=true"></u-cell-item>
        <view style="padding:20rpx 30rpx" class="u-flex u-row-between">
            <view style="font-size: 24rx;color: #909399;" v-if="duration.length>0">{{ durationDates[0] }} 至 {{ durationDates[duration.length-1] }}</view>
            <view style="font-size: 24rx;color: #909399;">共 {{ request.dayCount }} 天</view>
        </view>
        <u-cell-item title="出差类型" @click="showTypes = true" :value="request.type"/>
        <template v-if="request.type==TripType.本市">
            <u-cell-item title="出差地点" :value="request.to" @click="showToCity=true"/>
        </template>
        <template v-if="request.type==TripType.外地">
            <u-cell-item title="途径" :value="request.pass" @click="showPass=true"/>
            <u-cell-item title="出差地点" :value="request.to" @click="showOut=true"/>
        </template>
        <u-cell-item title="交通工具" @click="show = true" :value="request.traffic"/>
        <u-cell-item  title="选择同行人员" @click="goPeople"/>
        <view style="padding:20rpx; 30rpx">
            <template v-for="entourage in entourages">
                <u-tag class="mb-20" style="margin-right: 20rpx; display: inline-block;"  size="small" type="info" :text="entourage.name" />
            </template>                     
        </view>
	</u-cell-group>
    <u-card title="出差任务" margin="30rpx 0" :body-style="{padding:'30rpx'}">
        <template #body>
            <u-input v-model="request.reason" type="textarea" :border="true" placeholder="请填写出差任务" />
        </template>
    </u-card>
    <u-picker mode="selector" v-model="showToCity" :range="HDLabels" @confirm="onConfirmHD"></u-picker>
    <u-picker  v-model="show" mode="selector" :range="TrafficLables" @confirm="onConfirmTriffic"> </u-picker>
    <u-picker v-model="showTypes" mode="selector" :range="typeLabels" @confirm="onConfirmType"> </u-picker>
    <u-picker title="请选择途径城市" mode="region" v-model="showPass" @confirm="onConfirmPass"></u-picker>
    <u-picker title="请选择出差目的地" mode="region" v-model="showOut" @confirm="onConfirmOut"></u-picker>
    <u-calendar v-model="showCalendar" mode="range" @change="onChangeDays" :safe-area-inset-bottom="true" max-date="2050-12-31" />
    <view class="container" style="padding-top:20rpx">
         <u-button @click="Save" type="primary" size="medium" style="width: 100%;box-sizing: border-box;" >提交申请</u-button>
    </view>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { type CreateTripViewModel, TrafficType,TripType, type UserViewModel } from '@/api/admin/gen/typings';
import API from '@/api';
import { onActivated } from 'vue';
import { onBackPress, onShow, onUnload } from '@dcloudio/uni-app';
import dayjs from 'dayjs'
const entourages = ref<UserViewModel[]>([]);
const types = [
    {index:0,label:'本市',type:TripType.本市},
    {index:1,label:'外地',type:TripType.外地},
]
const typeLabels = types.map(item => item.label);
const showTypes = ref(false);
const showToCity = ref(false);
const showPass = ref(false);
const showOut = ref(false);

const onConfirmType = (e:any) => {
    request.value.type = types[e[0]].type;
    showTypes.value = false;
}

const onConfirmPass = (e:any) => {
    request.value.pass = e.city.name;
    request.value.passCode = e.city.code;
    showPass.value = false;
}

const onConfirmOut = (e:any) => {
    request.value.to = e.city.name;
    request.value.toCode = e.city.code;
    showOut.value = false;
}

const goPeople = ()=>{
    uni.navigateTo({
        url: `/pages/people2`
    });
}

onShow(async() => {
    const donners = uni.getStorageSync("entourages");
    if (donners){
        entourages.value = [...donners];
    }
});

onUnload(() => {
    console.log('back');
    uni.removeStorageSync("entourages");
});

const HD = [
    // { key: "130402", label: "邯山区" },
    // { key: "130403", label: "丛台区" },
    // { key: "130404", label: "复兴区" },
    // { key: "130406", label: "峰峰矿区" },
    { index:0,toCode: "130405", label: "冀南新区" },
    // { key: "130421", label: "邯郸县" },
    {index:1,toCode: "130423", label: "临漳县" },
    {index:2,toCode: "130424", label: "成安县" },
    {index:3,toCode: "130425", label: "大名县" },
    {index:4,toCode: "130426", label: "涉县" },
    {index:5,toCode: "130427", label: "磁县" },
    {index:6,toCode: "130428", label: "肥乡区" },
    {index:7,toCode: "130429", label: "永年区" },
    {index:8,toCode: "130430", label: "邱县" },
    {index:9,toCode: "130431", label: "鸡泽县" },
    {index:10,toCode: "130432", label: "广平县" },
    {index:11,toCode: "130433", label: "馆陶县" },
    {index:12,toCode: "130434", label: "魏县" },
    {index:13,toCode: "130435", label: "曲周县" },
    {index:14,toCode: "130481", label: "武安市" }
];
const HDLabels = HD.map(item => item.label);

const onConfirmHD = (e:any) => {
    request.value.to = HD[e[0]].label;
    request.value.toCode = HD[e[0]].toCode;
    showToCity.value = false;
}


const traffics = [
    {index:0,label:'长途汽车',type:TrafficType.长途汽车},
    {index:1,label:'公务用车',type:TrafficType.公务用车},
    {index:2,label:'火车',type:TrafficType.火车},
    {index:3,label:'飞机',type:TrafficType.飞机},
    {index:4,label:'其他',type:TrafficType.其他},
]

const TrafficLables = traffics.map(item => item.label);
const show = ref(false);
const showCalendar = ref(false);

const request = ref<CreateTripViewModel>({ });

const duration =ref<string[]>([]);
const durationDates =ref<string[]>([]);

const onConfirmTriffic = (e:any) => {
    
    request.value.traffic = traffics[e[0]].type;
    show.value = false;
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
         durationDates.value.push(dayjs(date).format('YYYY年MM月DD日'));
    }
     request.value.start = e.startDate;
    request.value.end = e.endDate;
    showCalendar.value = false;
}

onActivated(async () => {
   console.log('123');
});

const Save = async () => {

    if(!duration.value || duration.value.length == 0){
        uni.showToast({
            title: '请选择出差时间',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    if ( !request.value.type ) {
        uni.showToast({
            title: '请选择出差类型',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    if(request.value.type== TripType.外地){
        if ( !request.value.pass ) {
            uni.showToast({
                title: '请选择途径城市',
                icon: 'none',
                duration: 2000
            });
            return;
        }
    }



    if ( !request.value.to ) {
        uni.showToast({
            title: '请选择出差地点',
            icon: 'none',
            duration: 2000
        });
        return;
    }


    if ( !request.value.traffic ) {
        uni.showToast({
            title: '请选择交通工具',
            icon: 'none',
            duration: 2000
        });
        return;
    }


   
    if ( !request.value.reason || request.value.reason?.length == 0) {
        uni.showToast({
            title: '请填写出差任务',
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
        payload.type = types.find(item => item.type == request.value.type)?.index;
        payload.traffic = traffics.find(item => item.type == request.value.traffic)?.index;
        payload.entourage = entourages.value.map(item => item.name).join(',');
        const res = await API.Trip.Post(payload);
        if(res.id){
            uni.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            });
            
            uni.redirectTo({
                url: `/pages/check/index?id=${res.id}&prefix=FLCC&type=2`,
            });
        }
    }catch(e){
        console.log(e);
    }finally{
        uni.hideLoading();
    }
}
</script>