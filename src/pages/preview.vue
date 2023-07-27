<template>
  <view>
    <web-view :src="pdfUrl"></web-view>
  </view>
</template>

<script lang="ts">
import { Setting } from '@/config/setting';
export default {
  data() {
    return {
      pdfUrl: `${Setting.admin_app_api_base_url}/api/File/blob-download/1E49DDB1A7D27365.pdf`
    };
  }
};
</script>