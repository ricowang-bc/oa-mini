<template>
    <view class="mb-20">
        <u-cell-group class="mb-20">
            <template v-for="(item,i) in cellItems" :key="i">
                <u-cell-item :title="item.title"  :value="item.value" :arrow="false" />
            </template>
            <u-cell-item title="综合处拟办意见"  :arrow="false" />
            <view style="padding:20rpx 30rpx;font-size: 24rx;color: #909399;" >
                {{ flow.remark }}
            </view>
            
        </u-cell-group>

    </view>
    <view class="mb-20">
        <u-card title="文件列表" margin="30rpx 0">
            <template #body>
                <template v-for="file in Files">
                    <u-tag @click="previewFile(file)" :text="file">{{ file }}</u-tag>
                    <!-- <a href="previewFile(file)">{{ file }}</a> -->
                </template>
            </template>
        </u-card>
    </view>
</template>
<script setup lang="ts">
import type {  DocViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';
import {Setting} from '@/config/setting'
const props = defineProps<{
    flow: DocViewModel,
}>();

const Files = computed(() => {
    const flow = props.flow;
    return flow.files?.split(',') || [flow.files];
});


const previewFile = (file: any) => {
    file = file.trim();
    // uni.navigateTo({
    //     url: `/pages/preview?file=${file}`,
    // });
    // return;
    console.log(`${Setting.admin_app_api_base_url}/upload/${file}`);
    uni.downloadFile({
        url: `${Setting.admin_app_api_base_url}/upload/${file}`,
        // url:`${Setting.admin_app_api_base_url}/api/File/blob-download/${file}`,
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