<template>
    <view class="mb-20">
        <u-cell-group >
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
        </u-cell-group>
    </view>
    <view class="mb-20">
        <u-card title="文件列表" margin="30rpx 0">
            <template #body>
                <template v-if="flow.files">
                    <template v-for="file in Files">
                        <u-tag @click="previewFile(file)" :text="file">{{ file }}</u-tag>
                        <!-- <a href="previewFile(file)">{{ file }}</a> -->
                    </template>
                </template>
                <template v-else>
                    无
                </template>
            </template>
        </u-card>
    </view>
</template>
<script setup lang="ts">
import {Setting} from '@/config/setting'
import type {  SealFlowType,  WorkSealViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
const props = defineProps<{
    flow: WorkSealViewModel,
}>();

const Files = computed(() => {
    const flow = props.flow;
    const fileList = flow.files?.split(',') || [flow.files];
    console.log(fileList);
    return fileList;
});

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
        header = '普通程序用印';
    }
    else if (type == 1)
        header = '普通程序（5万元以下）用印';
    else if (type == 2)
        header = '普通程序（5万元以上）用印';
    else if (type == 3)
        header = '简易程序用印';
    else if (type == 4)
        header = '抽样封条盖章';
    else if (type == 5){ 
        header = '公文盖章';
        list = [
            {title:'公文名称',value:flow.gongWenName},
        ]
    }
    else if (type == 6){
        header = '前置文书盖章';
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
        
        {title:'用章',value:flow.sealLabel},
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
        
        ...list,
         {
            title: '用印原因',
            value: flow.reason,
        },
    ];
});


const previewFile =async (file: any) => {
    file = file.trim();
    const url = `${Setting.admin_app_api_base_url}/api/File/transfor/${file}`;

    uni.downloadFile({
        url: url,
        success: function (res) {
            // 根据file的扩展名 替换文件后缀
            const ext = file.split('.').pop();
            const filePath = res.tempFilePath;//.replace(/\.bin$/,`.${ext}`);
            console.log(filePath);
            uni.showModal({
                title:'提示',
                content:'文件已保存到本地',
                cancelText:'我知道了',
                confirmText:'打开文件',
                success:(r)=>{
                    if (r.confirm){
                        setTimeout(() => {
                            uni.openDocument({
                                filePath: filePath,
                                showMenu: false,
                                fileType: ext,
                                success: function (res) {
                                    console.log('打开文档成功');
                                },
                                fail: function (res) {
                                    console.log(res);
                                    uni.showToast({
                                        title: '暂不支持该格式文件',
                                        
                                        icon: 'none',
                                    })
                                },
                            });
                        }, 1000);
                    }
                }
            })
        },
        fail: function (res) {
            console.log(res);
        },
    });
};

</script>