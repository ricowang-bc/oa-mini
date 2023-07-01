<template>
    <u-cell-group>
        <u-cell-item title="审批编号" :value="flow.uuid " :arrow="false" />
        <u-cell-item title="会议地点" :value="flow.creatorDepartmentName||'undefend'" :arrow="false" />
        <u-cell-item title="会议时间" :value="flow.creatorDepartmentName||'undefend'" :arrow="false" />
        <u-cell-item title="参会人" value="王大海,席晓攀,admin,文档上传,文档管理,李彩萍,郭丽敏" :arrow="false" />
    </u-cell-group>
</template>
<script setup lang="ts">
import type {  WorkViewModel, } from '@/api/admin/gen/typings';
const props = defineProps<{
    flow: WorkViewModel 
}>();
</script>