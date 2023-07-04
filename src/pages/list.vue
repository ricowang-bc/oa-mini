<template>
    <!-- <view class="container" style="padding:20rpx 30rpx;background-color: #FFF;border-bottom: 2rpx solid #f8f8f9;">
         <u-search placeholder="输入编号查询" v-model:value="query.name"></u-search>
    </view> -->
	<u-tabs ref="uTabs" :current="query.mode" :list="tabs" :is-scroll="false" @change="tabsChange" ></u-tabs>
    <view class="container-body">
        <u-empty text="暂无数据" v-if="list.length == 0"></u-empty>
        <template  v-else>
            <template v-for="(row,i) in list" :key="i">
                <u-card :title-size="28" :head-style="{padding:'20rpx 20rpx'}" :foot-style="{padding:'20rpx 20rpx',fontSize:'24rpx',textAlign:'right'}" :border="false" @click="handleCheck(row)">
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
                        <view class="u-text-gray" style="font-size: 24rpx;">
                            <text> {{ row.creatorName}}的{{ row.prefix }}</text> 
                        </view>
                    </template>
                    <template #foot>
                        {{ getTime(row.createdTime) }}
                    </template>
                </u-card>
            </template>
        </template>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import API from '@/api'
import type {  WorkViewModel,FlowStatus, QueryParams,DocQueryRequest } from '@/api/admin/gen/typings';
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';



const tabs = [
	{
		name: "待处理",
	},
	{
		name: "已处理",

	},
    {
		name: "我申请的",
	},
];


const list = ref<WorkViewModel[]>([]);

const handleCheck = (row:WorkViewModel)=>{
    const prefix = row.uuid?.split('-')[0];
    uni.navigateTo({
        url: `/pages/check/index?id=${row.id}&prefix=${prefix}&type=${query.value.mode}`,
    });


}

const getPrefix = (prefix:any)=>{
    if (prefix == 'FLMR'){
        return '会议纪要';
    }
    if (prefix == 'FLYZ'){
        return '用章申请';
    }
    if (prefix == 'FLCC'){
        return '出差申请';
    }
    if (prefix == 'FLRR'){
        return '工作汇报';
    }
    if (prefix == 'FLQJ'){
        return '请假申请';
    }
    if (prefix == 'FLYC'){
        return '用车申请';
    }
     if (prefix == 'FLDC'){
        return '用车申请';
    }
    return '审批申请';
}

const fetchDataOthers = async ()=>{
    uni.showLoading({title: '加载中' });
    list.value = [];
    const parms = {page:1,limit:1000};
    const body = {name:'',mode:query.value.mode};
    let qs = await API.Leave.Query(parms,body);
    let ts = await API.Trip.Query(parms,body);
    let cs = await API.Che.Query(parms,body);
    let ws = await API.WorkSeal.Query(parms,body);
    let ms = await API.Meet.Query(parms,body);
    let rs = await API.Report.Query(parms,body);

    if (qs.data)
        list.value = list.value.concat(qs.data);
    if (ts.data)
        list.value = list.value.concat(ts.data);
    if (cs.data)
        list.value = list.value.concat(cs.data);
    if (ws.data)
        list.value = list.value.concat(ws.data);
    if (ms.data)
        list.value = list.value.concat(ms.data);
    if (rs.data)
        list.value = list.value.concat(rs.data);

    // 将 list.value 根据日期倒序排列
    list.value.sort((a,b)=>{
        const bTime :any= b.createdTime?.valueOf();
        const aTime :any = a.createdTime?.valueOf();
        // console.log(new Date(bTime).getTime());
        // console.log(new Date(aTime).getTime());
        return new Date(bTime).getTime()-new Date(aTime).getTime();
    })
    list.value.forEach((item:any)=>{
        item.prefix = getPrefix(item.prefix);
    })
     uni.hideLoading();

}


const tabsChange =async (index:any) => {
    query.value.mode = index;
    if (query.value.mode!=0){
       await fetchDataOthers();
    }else{
        await fetchData();
        if (list.value.length>0){
            uni.setTabBarBadge({
                index: 0,
                text: list.value.length.toString()
            })
        }
    }
    
    
    
}
const queryParms : any = ref<QueryParams>({
    page:1,
    limit:10000,
});
const query : any =ref<DocQueryRequest>({
    name:'',
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

const getTime = (time:any) =>{
    return timeFormat( time,'yyyy年mm月dd日 hh:MM');
}


onShow(async () => {
    tabsChange(0);
});

onPullDownRefresh(async ()=>{
    await fetchData();
    uni.stopPullDownRefresh();
})

const fetchData =async ()=>{
    uni.showLoading({title: '加载中' });
    let res =await API.Summary.Query(queryParms);
    if (res){
        list.value = res;
        
    }
    uni.hideLoading();
}
</script>
