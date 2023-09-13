a<template>
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
                        <!-- <u-tag @click="previewFile(file)" :text="file">{{ file }}</u-tag> -->
                        <!-- <a href="previewFile(file)">{{ file }}</a> -->
                        <image :src="`${upload}/upload/${file}`" mode="aspectFit" @click="previewFile(file)"/>
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
import {  OilState, type ReturnViewModel } from '@/api/admin/gen/typings';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';
import {Setting} from '@/config/setting'

import { computed } from 'vue';
const upload = Setting.admin_app_api_base_url;
const props = defineProps<{
    flow: ReturnViewModel,
}>();

const cellItems = computed(() => {
    const flow = props.flow;

    const oilState = flow.oilState== OilState.满?'满油': (flow.oilState==OilState.部分?'部分':'空');
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
            title: '车辆信息',
            value: `${flow.carBrand}-${flow.carNumber}`,
        },
        {
            title: '用车时间',
            value: `${timeFormat( flow.begin,'yyyy年mm月dd日')}-${timeFormat( flow.finish,'yyyy年mm月dd日')}`
        },
        {
            title: '出车前里程',
            value: `${flow.beginMileage}公里`,
        },
        {
            title: '当前里程',
            value: `${flow.recoredMileage}公里`,
        },
        {
            title: '当前油量',
            value: `${flow.recoredOil}升` 
        },
        // {
        //     title: '用车事由',
        //     value: flow.remark,
        // },
    ];
});

const Files = computed(() => {
    const flow = props.flow;
    return flow.files?.split(',') || [flow.files];
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