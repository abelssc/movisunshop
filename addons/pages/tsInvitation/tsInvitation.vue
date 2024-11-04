<template>
<view>
<tsCommon></tsCommon>

<view class="bg">
  <image :src="img_url+'Invitation.png'"></image>

  <view class="navigation">
    <navigator url="/addons/pages/tsMySubordinates/tsMySubordinates" hover-class="none" class="link">{{$L('我的下级')}}</navigator>
    <navigator url="/addons/pages/tsRule/tsRule" hover-class="none" class="link">{{$L('活动规则')}}</navigator>
  </view>
</view>

<common :title="$L('我的邀请')"></common>
</view>
</template>

<script>
	
export default {
  data() {
    return {
      img_url: getApp().globalData.img_url
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('我的邀请')
    });
  },
  methods: {}
};
</script>
<style>
.bg{
  position: relative;
  width: 750rpx;
  height: 100vh;
  overflow: hidden;
}

.bg image{
  width: 750rpx;
  height: 100vh;
}

.bg .navigation{
  position: absolute;
  top: 50%;
  right: 20rpx;
  margin-top: -70rpx;
}

.navigation .link{
  width: 124rpx;
  height: 60rpx;
  background-color: rgba(0,0,0,.7);
  border-radius: 0 30rpx 0 30rpx;
  text-align: center;
  line-height: 60rpx;
  color: #fff;
  font-size: 24rpx;
  margin-bottom: 20rpx;
}

.navigation .link:last-child{
  margin-bottom: 0;
}
</style>