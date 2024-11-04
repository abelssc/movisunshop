<template name="pageLoading">
  <view class="page_loading" v-if="firstLoading&&show_result">
    <image :src="img_url + 'live/page_loading_icon.gif'"></image>
  </view>
</template>