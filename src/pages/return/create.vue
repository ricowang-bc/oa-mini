<template>
    <view class="container-body" v-if="list.length == 0">
        <u-empty text="暂无需要还车数据" ></u-empty>
    </view>
    <template  v-else>
        <template v-for="(row,i) in list" :key="i">
            <u-card :foot-border-top="false" :title-size="28" :body-style="{padding:'0'}" :head-style="{padding:'20rpx 20rpx'}" :foot-style="{padding:'20rpx 20rpx',fontSize:'24rpx',textAlign:'right'}" :border="false" >
                <template #head>
                    <view class="u-flex flex-row-bewteen" style="justify-content: space-between;">
                        <view class="u-card__head--left u-flex u-line-1 ">
                            <text style="font-size:28rpx;color:#909399"> {{ row.uuid }}</text>
                        </view>
                        <view v-if="row.status!=undefined">
                            <u-tag   size="small" :type="getStatus(row.status).type" :text="getStatus(row.status).text" />
                        </view>
                    </view>
                </template>
                <template #body>
                    <u-cell-group >
                        <template v-for="(item,i) in cellItems(row)" :key="i">
                            <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
                        </template>
                    </u-cell-group>
                    <template v-if="show && request?.flowID == row.id">
                        <u-cell-item title="当前里程"  :arrow="false" >
                            <template #right-icon>
                                <u-input type="number" v-model="request.recoredMileage" :border="true" placeholder="请输入当前里程" />
                            </template>
                        </u-cell-item>
                        <!-- <u-cell-item title="当前油量" :arrow="false">
                            <template #right-icon>
                                <u-input type="number" v-model="request.recoredOil"  :border="true" placeholder="请输入当前油量" />
                            </template>
                        </u-cell-item>
                        <u-cell-item title="油量状态" :value="request.oilState" @click="show2 = true" /> -->
                        <u-upload :max-count="3" :action="action"  @on-success="SetRequestFile" @on-list-change="ChangeRequestFile"></u-upload>
                    </template>
                </template>
                <template #foot>
                    <template v-if="show && request?.flowID==row.id">
                        <view class="u-flex u-row-between">
                            <u-button type="error" size="medium" @click="cancel" style="flex:1;margin-right:10rpx">取消</u-button>
                            <u-button type="primary" size="medium" style="flex:1;margin-left:10rpx" @click="submit">提交</u-button>
                        </view>
                    </template>
                    <template v-else>
                        <u-button :disabled="!row.canReturn" type="primary" size="medium" @click="ShowReturn(row)">还车</u-button>
                    </template>
                </template>
            </u-card>
        </template>
        <u-picker v-model="show2" mode="selector" :range="statesLables" @confirm="onConfirmOil"> </u-picker>
    </template>
    
</template>
<script setup lang="ts">

export type UploadFile={
    url:string
}

import { onMounted, ref } from 'vue';
import API from '@/api'
import{  OilState, type CheViewModel,type CreateReturnViewModel } from '@/api/admin/gen/typings';
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';
import { Setting } from '@/config/setting';

const list = ref<CheViewModel[]>([]);
const show = ref<boolean>(false);
const show2 = ref<boolean>(false);
const request = ref<CreateReturnViewModel>({});
const action = `${Setting.admin_app_api_base_url}/api/File`;
const states = [
    {index:0,label:'满',type:OilState.满},
    {index:1,label:'部分',type:OilState.部分},
    {index:2,label:'空',type:OilState.空},
]

const statesLables = states.map(item => item.label);


onShow(async () => {
    await getCarList();
});
const getCarList  = async ()=>{
    let res = await API.Che.Records();
    if (res){
        list.value = res;
    }
}

const getTime = (time:any) =>{
    return timeFormat( time,'yyyy年mm月dd日 hh:MM');
}

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
            type:'warning'
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


const cellItems = (flow:CheViewModel) => {

    return [
         {
            title: '车辆信息',
            value: `${flow.carBrand}-${flow.carNumber}`,
        },
        {
            title: '用车时间',
            value: `${timeFormat( flow.begin,'yyyy年mm月dd日')}-${timeFormat( flow.finish,'yyyy年mm月dd日')}`
        },
        {
            title: '出车前里程',
            value: `${flow.beginMileage}公里`,
        },
        {
            title: '申请时间',
            value: `${timeFormat( flow.createdTime,'yyyy年mm月dd日')}-${timeFormat( flow.createdTime,'yyyy年mm月dd日')}`
        },
    ];
};

const ShowReturn = (row:CheViewModel)=>{
    show.value = true;
    request.value = {
        flowID:row.id,
        recoredMileage:undefined,
        recoredOil:undefined,
        files:undefined,
        oilState:undefined
    }
}

const onConfirmOil = (e:any) => {
    
    show2.value = false;
    request.value.oilState = states[e[0]].type;
}

const cancel = ()=>{
    show.value = false;
    request.value = {};
}

const isNumber = (value:any)=>{
    
    const reg = /^\d+$/;
    return !reg.test(value);
}

const SetRequestFile = (data:any, index:any, lists:any, name:any)=>{
    let array = new Array<string>();
    for(let file of lists){
       let filename = file.url.replace('http://tmp/','');
       if (!array.includes(filename)){
            array.push(filename);
       }
    }
    request.value.files = array.join(',');
}

const ChangeRequestFile =  (lists:any, name:any)=>{

}

const submit = async ()=>{
    if (!request.value.recoredMileage|| isNumber(request.value.recoredMileage)){
        uni.showToast({
            title:'请输入正确的里程数',
            duration:2000,
            icon:'none'
        });
        return;
    }
    // if (!request.value.recoredOil||isNumber(request.value.recoredOil)){
    //     uni.showToast({
    //         title:'请输入正确的油量数',
    //         duration:2000,
    //         icon:'none'
    //     });
    //     return;
    // }

    // if (!request.value.oilState){
    //     uni.showToast({
    //         title:'请选择油量状态',
    //         duration:2000,
    //         icon:'none'
    //     });
    //     return;
    // }
   
    if (!request.value.files || request.value.files.length==0){
        uni.showToast({
            title:'请上传照片',
            duration:2000,
            icon:'none'
        });
        return;
    }

    const flow = list.value.find(x=>x.id==request.value.flowID);
    if (request.value.recoredMileage!<flow!.beginMileage!){
        uni.showToast({
            title:'当前里程不能小于出车里程',
            duration:2000,
            icon:'none'
        });
        return;
    }
    uni.showLoading({
        title: '提交中...',
        mask: true
    });
    try{
        let payload :any= {...request.value};
        payload.oilState = states.find(x=>x.type == request.value.oilState)?.index;
        let res:any = await API.Return.Post(payload);
        if(!res.errors){
            uni.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            });
            await getCarList();
        }
    }catch(e){
        console.log(e);
    }finally{
        uni.hideLoading();
    }
    
}
</script>

<style scoped>
    .u-cell{
        padding:0 !important
    }

</style>