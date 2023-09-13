a<template>
    <view class="mb-20">
        <u-cell-group >
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
            <u-cell-item title="请假日期"  :arrow="false" />
            <view style="padding:20rpx 30rpx" class="u-flex u-row-between">
                <view style="font-size: 24rx;color: #909399;">{{ Days }}</view>
                <view style="font-size: 24rx;color: #909399;">共 {{ flow.dayCount }} 天</view>
            </view>
        </u-cell-group>
    </view>
</template>
<script setup lang="ts">
import type {  LeaveViewModel, } from '@/api/admin/gen/typings';
import dayjs from 'dayjs';

import { computed } from 'vue';
const props = defineProps<{
    flow: LeaveViewModel,
}>();

const Days = computed(()=>{
    if (props.flow && props.flow.days){
        return props.flow.days.split(',').map(day=>{
            return dayjs(day).format('YYYY年MM月DD日');
        }).join(',');
    }
    return '';
})

const cellItems = computed(() => {
    const flow = props.flow;
    const type :any = flow.type;
    const leaves = ['事假',
        '病假',
        '婚假',
        '产假',
        '丧假',
        '探亲假',
        '年休假',
        '其他'
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
            title: '请假类别',
            value: leaves[type],
        },
        {
            title: '请假原因',
            value: flow.reason,
        },
    ];
});

</script>