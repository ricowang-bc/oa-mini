<template>
    <view class="container safe-area-inset-bottom">
        <u-card title="审批" margin="30rpx 0rpx" :body-style="{padding:'0rpx'}" :head-style="{padding:'20rpx 30rpx'}">
            <template #body>
                <u-grid :col="3">
                    <template v-for="(item,index) in gridList"  :key="index">
                        <u-grid-item @click="goOA(item)" >
                            <view class="bg-primary grid-bg">
                                <u-icon :name="item?.icon" :size="40" color="#FFF"></u-icon>
                            </view>
                            <view class="grid-text">{{item?.title}}</view>
                        </u-grid-item>
                    </template>
                </u-grid>
            </template>
        </u-card>
        <u-card title="通知公告" margin="30rpx 0rpx" :head-style="{padding:'20rpx 30rpx',color:'#909399'}">
            <template #body>
                <u-empty text="暂无通知" mode="list"></u-empty>
            </template>
        </u-card>
    </view>
</template>

<script setup lang="ts">

export type GridItem = {
    icon :string,
    title:string,
    prefix:string,
    link:string
}
const GITEMS = [{ icon:'calendar', title:'请假',prefix:'FLQJ',link:'leave' },
    { icon:'clock', title:'出差',prefix:'FLCC',link:'trip' },
    { icon:'car', title:'用车',prefix:'FLYC',link:'car' },
    { icon:'car', title:'还车',prefix:'FLHC',link:'return' }
    // { icon:'file-text', title:'工作汇报',prefix:'FLRR',link:'report' },
    // { icon:'moments', title:'用章',prefix:'FLYZ' },
    // { icon:'bookmark', title:'会议纪要',prefix:'FLMR' },
]
import { onMounted, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import API from '@/api'
import  type{  QueryParams } from '@/api/admin/gen/typings';
const gridList = ref<GridItem[]>(GITEMS);
const goOA = (item:GridItem | undefined) => {
    if (item && item.link=='return'){

    }

    if(item){
         uni.navigateTo({
              url: `/pages/${item.link}/create`
         })
   }
}

const getCarList  = async ()=>{
    let res = await API.Che.Records();
    gridList.value = [...GITEMS];
    if (res){
        gridList.value.push({ icon:'car', title:'还车',prefix:'FLHC',link:'return' })
    }
}

const queryParms : any = ref<QueryParams>({
    page:1,
    limit:10000,
});
onShow(async () => {
    let res =await API.Summary.Query(queryParms);
    const list = res;
    if (list.length>0){
        uni.setTabBarBadge({
            index: 1,
            text: list.length.toString()
        })
    }else{
        uni.removeTabBarBadge({
            index: 1
        })
    }
    await setBadge2();
    // await getCarList();
});

const setBadge2 = async()=>{
    const q:any = {name:'',title:'',mode:0};
    let res =await API.Doc.Query({page:1,limit:10000},q);
    if (res){
        const docs: any = res.data;
        if (docs.filter((x:any)=>x.state<=2).length>0){
            uni.setTabBarBadge({
                index: 2,
                text: docs.length.toString()
            })
        }else{
             uni.removeTabBarBadge({
            index: 2
        })
    }
    }
}

</script>

<style scoped lang="scss">
    .grid-bg{
        padding:20rpx;
        border-radius: 12rpx;
        text-align: center;
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
	.grid-text {
		font-size: 26rpx;
		margin-top: 16rpx;
		color: $u-type-info;
	}
</style>