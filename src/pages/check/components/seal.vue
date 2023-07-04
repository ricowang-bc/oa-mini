<template>
    <view class="mb-20">
        <u-cell-group >
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
        </u-cell-group>
    </view>
</template>
<script setup lang="ts">
import type {  SealFlowType,  WorkSealViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
const props = defineProps<{
    flow: WorkSealViewModel,
}>();


const cellItems = computed(() => {
    const flow = props.flow;
    const type :any = flow.type;
    let header = '申请';
    let list :any[] = [
        {title:'用印文书名称',value:flow.bookName},
        {title:'用印文书案号',value:flow.bookISBN},
        {title:'用印数量',value:flow.bookCount},
    ];

    if (type == 0) {
        header = '普通程序用印审批单';
    }
    else if (type == 1)
        header = '普通程序（5万元以下）用印审批单';
    else if (type == 2)
        header = '普通程序（5万元以上）用印审批单';
    else if (type == 3)
        header = '简易程序用印审批单';
    else if (type == 4)
        header = '抽样封条盖章申请表';
    else if (type == 5){ 
        header = '公文盖章申请表';
        list = [
            {title:'公文名称',value:flow.gongWenName},
        ]
    }
    else if (type == 6){
        header = '前置文书盖章申请表';
        list = [
            {title:'前置文书名称',value:flow.qianZhiName},
            {title:'前置文书案号',value:flow.qianZhiISBN},
            {title:'用印数量',value:flow.qianZhiCount},
        ]
    }


    
    return [
        {
            title: '审批编号',
            value: flow.uuid,
        },
        {
            title:'用印类型',
            value: header,
        },
        {
            title: '用印部门',
            value: flow.creatorDepartmentName,
        },
        {
            title: '经办人',
            value: flow.creatorName,
        },
        
        ...list
    ];
});

</script>