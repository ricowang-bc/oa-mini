<template>
    <view class="mb-20">
        <u-cell-group >
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
            <u-cell-item title="同行人员"  :arrow="false" />
            <view style="padding:20rpx 30rpx">
                <u-tag size="mini" v-for="person in flow.entourage?.split(',')" :text="person">{{ person }}</u-tag>
            </view>
        </u-cell-group>
        
    </view>
</template>
<script setup lang="ts">
import type {  TripViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';

const props = defineProps<{
    flow: TripViewModel,
}>();

const cellItems = computed(() => {
    const flow = props.flow;
    const traffic :any = flow.traffic;
    const type :any = flow.type;
    let path = '邯郸市';
    if(type==1){
        path= `邯郸市 经 ${ flow.pass } 至 ${ flow.to }`;
    }
    if(type==0){
        path =`邯郸市 ${ flow.to }`;
    }

    const leaves = ['长途汽车',
        '公务用车',
        '火车',
        '飞机',
        '其他',
    ];
    return [
        {
            title: '审批编号',
            value: flow.uuid,
        },
        {
            title: '所在部门',
            value: flow.creatorDepartmentName,
        },
        {
            title: '申请人',
            value: flow.creatorName,
        },
        {
            title: '交通工具',
            value: leaves[traffic],
        },
        {
            title: '时间',
            value: timeFormat(flow.start) + ' 至 ' + timeFormat(flow.end),
        },
        {
            title: '地点',
            value: path,
        },
        {
            title: '任务',
            value: flow.reason,
        },
    ];
});

</script>