<template name="emptyData">
  <view class="empty_data" v-if="!firstLoading&&!list.length">
      <image :src="img_url+'live/live_list_empty_icon.png'" mode="aspectFit"></image>
      <text>{{$L('暂无数据')}}</text>
  </view>
</template>