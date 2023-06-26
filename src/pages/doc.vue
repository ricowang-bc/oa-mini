<template>
    <!-- <view class="container" style="padding:20rpx 30rpx;background-color: #FFF;border-bottom: 2rpx solid #f8f8f9;">
         <u-search placeholder="输入编号查询" v-model:value="query.name"></u-search>
    </view> -->
    <u-tabs ref="uTabs" :current="query.mode" :list="tabs" :is-scroll="false" @change="tabsChange"  ></u-tabs>
    <view class="container-body">
        <u-empty text="暂无数据" v-if="list.length == 0"></u-empty>
        <template  v-else>
            <template v-for="(doc,i) in list" :key="i">
                <u-card :title-size="28" :head-style="{padding:'20rpx 20rpx'}" :border="false">
                    <template #head>
                        <view class="u-flex flex-row-bewteen" style="justify-content: space-between;">
                            <view class="u-card__head--left u-flex u-line-1 ">
                                <text style="font-size:28rpx;color:#909399"> {{ doc.uuid }}</text>
                            </view>
                            <view>
                                <u-tag   size="small" :type="getPri(doc.priority).type" :text="getPri(doc.priority).text" />
                            </view>
                        </view>
                    </template>
                    <template #body>
                        <view class="u-text-gray" style="font-size: 24rpx;">
                            <text> 文件名称：{{doc.title}}</text>
                            
                        </view>
                        <view class="u-text-gray" style="font-size: 24rpx;">来文单位：{{doc.unit}}</view>
                    </template>
                </u-card>
            </template>
        </template>
    </view>
</template>

<script setup lang="ts">
import { ref ,onMounted } from 'vue';
import API from '@/api'
import {    type DocQueryRequest,   type QueryParams,  type DocViewModel, Priority } from '@/api/admin/gen/typings';
import { onPullDownRefresh } from '@dcloudio/uni-app';
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

const getPri = (priority:any)=>{
    if (priority == 1){
        return {
            text:Priority.一般程序,
            type:'success'
        };
    }
    return {
        text:Priority.紧急知会,
        type:'warning'
    };
}


const list = ref<DocViewModel[]>([]);

const tabsChange =async (index:any) => {
    query.value.mode = index;
    await fetchData();
}
const queryParms : QueryParams = {
    page:1,
    limit:10000,
}
const query : any =ref<DocQueryRequest>({
    name:'',
    title:'',
});


onMounted(async () => {
    tabsChange(0);
});

onPullDownRefresh(async ()=>{
    await fetchData();
    uni.stopPullDownRefresh();
})


const fetchData = async ()=>{
    uni.showLoading({title: '加载中' });
    let res =await API.Doc.Query(queryParms,query.value);
    if (res.data){
        list.value = res.data;
    }
    uni.hideLoading();
}
</script>