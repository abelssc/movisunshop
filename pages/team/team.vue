<template>
<view>
<view class="balance">
  <view class="balance_top">
    <image class="bg" :src="img_url+'bg.png'" mode="widthFix"></image>
    <view class="right">
      <text>{{$L('推广总人数')}}</text>
      <text>{{total}}</text>
    </view>
  </view>

  <view class="balance_bottom">
    <scroll-view scroll-y>
      <view class="item">
        <view class="item_top">
          <view class="desc">{{$L('一级会员')}}</view>
          <view class="num red">{{grade1}}</view>
        </view>
        <view class="item_bottom">
          <navigator hover-class="none" url="/pages/team/team_detail?type=1">
            {{$L('点击查看全部')}}
          </navigator>
        </view>
      </view>

      <view class="item">
        <view class="item_top">
          <view class="desc">{{$L('二级会员')}}</view>
          <view class="num red">{{grade2}}</view>
        </view>
        <view class="item_bottom">
          <navigator hover-class="none" url="/pages/team/team_detail?type=2">
            {{$L('点击查看全部')}}
          </navigator>
        </view>
      </view>

      <!-- <view class='item'>
        <view class='item_top'>
          <view class="desc">三级会员</view>
          <view class="num red">{{grade3}}</view>
        </view>
        <view class="item_bottom">
          <navigator hover-class="none" url="/pages/team/team_detail?type=3">
            点击查看全部
          </navigator>
        </view>
      </view> -->
    </scroll-view>
  </view>

</view>

<common :title="$L('我的团队')"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      key: '',
      img_url: getApp().globalData.img_url
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('我的团队')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.initData();
  },
  methods: {
    initData() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getTuigNum&key=' + this.key
      }).then(res => {
        if (res.code == 200) {
          this.setData({ ...res.datas
          });
        }
      });
    }

  }
};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
.balance {
  width: 750rpx;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.balance .balance_top {
  position: relative;
  height: 136rpx;
  overflow: hidden;
}

.balance_top .bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.balance_top .bg image {
  width: 100%;
}

.balance_top .cz {
  position: absolute;
  top: 66rpx;
  left: 18rpx;
  width: 115rpx;
  height: 50rpx;
  line-height: 50rpx;
  background-color: #c7900d;
  color: #fff;
  font-size: 28rpx;
  z-index: 3;
  text-align: center;
  border-radius: 8rpx;
}

.balance_top>view.right {
  position: relative;
  text-align: right;
  z-index: 2;
  color: #fff;
  padding-top: 20rpx;
  padding-right: 30rpx;
}

.balance_top>view text {
  display: block;
}

.balance_top>view text:nth-child(1) {
  font-size: 28rpx;
}

.balance_top>view text:nth-child(2) {
  font-size: 46rpx;
}

.balance .balance_bottom {
  height: calc(100vh - 136rpx);
}

.balance_bottom scroll-view {
  height: 100%;
  overflow: hidden;
}

.item {
  background-color: #fff;
  color: #666;
  padding: 20rpx;
  font-size: 28rpx;
  border-bottom: 1rpx solid #e3e5e9;
}

.item_top{
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.item_top .desc{
  flex: 1;
  font-size: 26rpx;
  color: #232326;
}

.item_top .num{
  font-size: 26rpx;
  color: #6d6d6d;
}

.item_top .num.red{
  color: #f23030
}

.item_bottom{
  text-align: right;
  color: #848689;
  font-size: 24rpx;
  margin-top: 15rpx;
}

.item_bottom navigator{
  display: inline-block;
}

.item:last-child {
  margin-bottom: 0;
}

.placeholder_style {
  color: #9f9f9f;
  font-size: 34rpx;
}

.not {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;
}

.not .img {
  width: 140rpx;
  height: 140rpx;
  background-color: #ddd;
  border-radius: 50%;
  overflow: hidden;
}

.not .img image {
  width: 80rpx;
  height: 80rpx;
  margin-top: 31rpx;
  margin-left: 29rpx;
}

.not text {
  margin-top: 30rpx;
  font-size: 30rpx;
  color: #000;
}

</style>