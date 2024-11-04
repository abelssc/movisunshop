<template name="dataLoading">
  <view class="loading" v-if="hasmore&&loading">
    <view class="spinner">
      <text></text>
    </view>
 {{$L('数据加载中...')}}
  </view>
</template>