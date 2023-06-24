<template>
    <view class="container safe-area-inset-bottom">
        <u-card title="审批" margin="30rpx 0rpx" :body-style="{padding:'0rpx'}" :head-style="{padding:'20rpx 30rpx'}">
            <template #body>
                <u-grid :col="3">
                    <template v-for="(item,index) in gridList"  :key="index">
                        <u-grid-item @click="goOA(item.link)" >
                            <view class="bg-primary grid-bg">
                                <u-icon :name="item.icon" :size="40" color="#FFF"></u-icon>
                            </view>
                            <view class="grid-text">{{item.title}}</view>
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
const gridList = [
    { icon:'calendar', title:'请假',prefix:'FLQJ' },
    { icon:'clock', title:'出差',prefix:'FLCC' },
    { icon:'car', title:'用车',prefix:'FLYC' },
    { icon:'file-text', title:'工作汇报',prefix:'FLRR',link:'report' },
    { icon:'moments', title:'用章',prefix:'FLYZ' },
    { icon:'bookmark', title:'会议纪要',prefix:'FLMR' },
];
const goOA = (link:string | undefined) => {
   if(link){
         uni.navigateTo({
              url: `/pages/${link}/list`
         })
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