<template>
<!--pages/module_close/module_close.wxml-->
<view class="module_close">
    <image :src="img_url+'module_close.png'"></image>
    <text class="tip">{{$L('模块未开启')}}</text>
    <text class="go_home" @tap="goHome">{{$L('点击返回首页')}}</text>
</view>
</template>

<script>
const img_url = getApp().globalData.img_url;

export default {
  data() {
    return {
      img_url: getApp().globalData.img_url,
      module_close: img_url + 'module_close.png'
    };
  },

  components: {},
  props: {},
  onLoad() {
    uni.setNavigationBarTitle({
        title: this.$L('温馨提示')
    });
  },
  methods: {
    /**
     * 跳转首页
     */
    goHome: function () {
      uni.reLaunch({
        url: '/pages/index/index'
      });
    }
  }
};
</script>
<style>
/* pages/module_close/module_close.wxss */
page{
    background: #F8F8F8;
	display: flex;
	justify-content: center;
}


.module_close{
    overflow: hidden;
    margin-top: 20rpx;
    width: 750rpx;
    height:calc(100vh - 20rpx);
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.module_close image{
    margin-top: -300rpx;
    width: 252rpx;
    height: 206rpx;
}

.module_close .tip{
    color: #666666;
    font-size: 28rpx;
    font-weight: 600;
    margin-top: 25rpx;
}

.module_close .go_home{
    color: #949494;
    font-size: 24rpx;
    margin-top: 10rpx;
}
</style>