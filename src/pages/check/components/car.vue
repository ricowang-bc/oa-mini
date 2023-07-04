a<template>
    <view class="mb-20">
        <u-cell-group >
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
        </u-cell-group>
    </view>
</template>
<script setup lang="ts">
import type {  CheViewModel, } from '@/api/admin/gen/typings';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';

import { computed } from 'vue';
const props = defineProps<{
    flow: CheViewModel,
}>();


const cellItems = computed(() => {
    const flow = props.flow;

    return [
        {
            title: '审批编号',
            value: flow.uuid,
        },
        {
            title: '用车部门',
            value: flow.creatorDepartmentName,
        },
        {
            title: '申请人',
            value: flow.creatorName,
        },
        {
            title: '用车时间',
            value: timeFormat( flow.begin,'yyyy年mm月dd日')
        },
        {
            title: '出车前里程',
            value: `${flow.beginMileage}公里`,
        },
        {
            title: '用车事由',
            value: flow.remark,
        },
    ];
});

</script>