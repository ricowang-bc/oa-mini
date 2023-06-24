<template>
    <!-- <view class="container" style="padding:20rpx 30rpx;background-color: #FFF;border-bottom: 2rpx solid #f8f8f9;">
         <u-search placeholder="输入编号查询" v-model:value="query.name"></u-search>
    </view> -->
	<u-tabs ref="uTabs" :current="current" :list="tabs" :is-scroll="false" @change="tabsChange" ></u-tabs>
    <view>
        <u-empty style="padding-top:400rpx" text="暂无数据" v-if="list.length == 0"></u-empty>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import API from '@/api'
import type { WorkViewModel,  QueryParams } from '@/api/admin/gen/typings';
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
