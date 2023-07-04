<template>
    <view class="mb-20">
        <u-cell-group >
            <u-cell-item title="所在部门" :value="flow.creatorDepartmentName " :arrow="false" />
            <u-cell-item title="审批编号" :value="flow.uuid " :arrow="false" />
            <u-cell-item title="汇报内容" :arrow="false" />
            <view style="padding:20rpx 30rpx">
                <rich-text :nodes="flow.content"></rich-text>
            </view>
        </u-cell-group>
        
    </view>
</template>
<script setup lang="ts">
import type {  ReportViewModel, } from '@/api/admin/gen/typings';
const props = defineProps<{
    flow: ReportViewModel,
}>();


</script>