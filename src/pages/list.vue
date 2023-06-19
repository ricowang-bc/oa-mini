<template>
    <view class="container" style="padding:20rpx 30rpx;background-color: #FFF;border-bottom: 2rpx solid #f8f8f9;">
         <u-search placeholder="日照香炉生紫烟" v-model:value="query.name"></u-search>
    </view>
	<u-tabs ref="uTabs" :current="current" :list="tabs" :is-scroll="false" @change="tabsChange" ></u-tabs>
    <view>
        <u-empty style="padding-top:400rpx" text="暂无数据" v-if="list.length == 0"></u-empty>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import API from '@/api'
import type { ReportViewModel,  QueryParams } from '@/api/admin/gen/typings';
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


const list = ref<ReportViewModel[]>([]);

const tabsChange =async (index:any) => {
    current.value =index;
    await fetchData();
}
const queryParms : QueryParams = {
    page:1,
    limit:10,
}
const query : any = {
    name:'',
    mode:current.value,
}

onMounted(async () => {
    await fetchData();
});


const fetchData =async ()=>{
    await uni.showLoading({ });
    let res =await API.Report.Query(queryParms,query);
    if (res.data){
        list.value = res.data;
        console.log(list.value.length);
    }
    uni.hideLoading();
}
</script>
