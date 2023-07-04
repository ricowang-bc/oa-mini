<template>
    <view class="mb-20">
        <u-cell-group >
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
            <u-cell-item title="综合处拟办意见"  :arrow="false" />
            <view style="padding:20rpx 30rpx;font-size: 24rx;color: #909399;" >
                {{ flow.remark }}
            </view>
        </u-cell-group>
    </view>
</template>
<script setup lang="ts">
import type {  DocViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';

const props = defineProps<{
    flow: DocViewModel,
}>();

const cellItems = computed(() => {
    const flow = props.flow;

    return [
        {
            title: '审批编号',
            value: flow.uuid,
        },
        {
            title: '文件编号',
            value: `${flow.source} - ${flow.number}号`,
        },
        {
            title: '文件标题',
            value: flow.title,
        },
        {
            title: '来文单位',
            value: flow.unit,
        },
        {
            title: '收文时间',
            value: timeFormat( flow.createdTime,'yyyy年mm月dd日')
        },
        {
            title: '文号',
            value: `${flow.weHao}`,
        },
        {
            title: '密级',
            value: '-',
        },
        {
            title: '份数',
            value: 1,
        },
    ];
});
</script>