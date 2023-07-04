<template>
    <view class="mb-20">
        <u-cell-group >
            <u-cell-item title="审批编号" :value="flow.uuid " :arrow="false" />
            <u-cell-item title="所在部门" :value="flow.creatorDepartmentName " :arrow="false" />
            <u-cell-item title="会议地点" :value="flow.room" :arrow="false" />
            <u-cell-item title="会议时间" :value="meetTime" :arrow="false" />
            <u-cell-item title="请假日期"  :arrow="false" />
            <view style="padding:20rpx 30rpx" class="u-flex u-row-between">
                <u-tag size="mini" v-for="person in members" :text="person">{{ person }}</u-tag>
            </view>
        </u-cell-group>
    </view>
</template>
<script setup lang="ts">
import type {  MeetingViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';
const props = defineProps<{
    flow: MeetingViewModel,
}>();

// getter 将 flow.meetTime 格式化为 'yyyy-mm-dd hh:mm'
const meetTime = computed(() => {
    return timeFormat( props.flow.meetTime,'yyyy年mm月dd日');
});

const members = computed(() => {
    return props.flow.steps?.map((item) => item.userName);
});

</script>