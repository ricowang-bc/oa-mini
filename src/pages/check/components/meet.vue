<template>
    <view class="mb-20">
        <u-cell-group >
            <u-cell-item title="审批编号" :value="flow.uuid " :arrow="false" />
            <u-cell-item title="所在部门" :value="flow.creatorDepartmentName " :arrow="false" />
            <u-cell-item title="会议地点" :value="flow.room" :arrow="false" />
            <u-cell-item title="会议时间" :value="meetTime" :arrow="false" />
            <u-cell-item title="参会人员"  :arrow="false" />
            <view style="padding:20rpx 30rpx" class="u-flex u-row-start">
                <u-tag size="mini" v-for="person in members" :text="person">{{ person }}</u-tag>
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
import type {  MeetingViewModel, } from '@/api/admin/gen/typings';
import { computed } from 'vue';
import timeFormat from '@/uni_modules/vk-uview-ui/libs/function/timeFormat';
import {Setting} from '@/config/setting'
const props = defineProps<{
    flow: MeetingViewModel,
}>();

// getter 将 flow.meetTime 格式化为 'yyyy-mm-dd hh:mm'
const meetTime = computed(() => {
    return timeFormat( props.flow.meetTime,'yyyy年mm月dd日');
});
const Files = computed(() => {
    const flow = props.flow;
    return flow.files?.split(',') || [flow.files];
});
const members = computed(() => {
    return props.flow.steps?.map((item) => item.userName);
});
const previewFile = (file: any) => {
    file = file.trim();
    // uni.navigateTo({
    //     url: `/pages/preview?file=${file}`,
    // });
    // return;
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
</script>