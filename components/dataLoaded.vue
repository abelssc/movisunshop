<template name="dataLoaded">
  <view class="no-has-more" v-if="!hasmore&&list.length>0" style="background-color: transparent">
  {{$L('数据加载完毕~')}}
  </view>
</template>