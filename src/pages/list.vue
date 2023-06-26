<template>
    <!-- <view class="container" style="padding:20rpx 30rpx;background-color: #FFF;border-bottom: 2rpx solid #f8f8f9;">
         <u-search placeholder="输入编号查询" v-model:value="query.name"></u-search>
    </view> -->
	<u-tabs ref="uTabs" :current="query.mode" :list="tabs" :is-scroll="false" @change="tabsChange" ></u-tabs>
    <view class="container-body">
        <u-empty text="暂无数据" v-if="list.length == 0"></u-empty>
        <template  v-else>
            <template v-for="(row,i) in list" :key="i">
                <u-card :title-size="28" :head-style="{padding:'20rpx 20rpx'}" :border="false">
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
                        <!-- <view class="u-text-gray" style="font-size: 24rpx;">来文单位：{{doc.unit}}</view> -->
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
import { onPullDownRefresh } from '@dcloudio/uni-app';

const current = ref(0);

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
	{
		name: "全部",
	},
];


const list = ref<WorkViewModel[]>([]);



const tabsChange =async (index:any) => {
    console.log(index);
    query.value.mode = index;
    if (query.value.mode!=0){
       queryParms.value.limit = 0;
       uni.showLoading({title: '加载中' });
       list.value=[];
       uni.hideLoading();
       return;
    }
    
    await fetchData();
    
}
const queryParms : any = ref<QueryParams>({
    page:1,
    limit:10000,
});
const query : any =ref<DocQueryRequest>({
    name:'',
    title:'',
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


onMounted(async () => {
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
