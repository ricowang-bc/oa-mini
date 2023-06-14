<template>
    <view class="content">
        <u-button type="primary">主要按钮</u-button>
        <u-button type="success">成功按钮</u-button>
        <u-button type="info">信息按钮</u-button>
        <u-button type="warning">警告按钮</u-button>
        <u-button type="error" @click="go">危险按钮</u-button>
        {{title}}123
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
const title = ref("Hello");

// go
const go = () => {
    uni.navigateTo({
        url: '/pages/index/index'
    })
}
</script>