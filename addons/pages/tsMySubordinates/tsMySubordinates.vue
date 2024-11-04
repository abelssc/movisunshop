<template>
<view>
<tsCommon></tsCommon>

<view class="wrap">
  <view class="thead">
    <text class="th">{{$L('邀请时间')}}</text>
    <text class="th">{{$L('注册时间')}}</text>
    <text class="th">{{$L('奖励金额')}}</text>
  </view>

  <view class="tbody" v-if="list.length">
    <view v-for="(item, index) in list" :key="index" class="tr">
      <view class="td">{{item.member_name}}</view>
      <view class="td">{{item.member_time}}</view>
      <view class="td">{{item.yj_amount}}</view>
    </view>
  </view>

  <view class="empty" v-if="!list.length">
    <image :src="img_url+'addons/txempty.png'"></image>
    <text>{{$L('暂无数据')}}</text>
  </view>
</view>

<common :title="$L('我的下级')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      list: [],
      ssys_key: '',
      img_url: getApp().globalData.img_url //图片地址

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('我的下级')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key
    });
    this.getMemberSubordinates();
  },
  methods: {
    getMemberSubordinates() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberSubordinates&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key
        },
        success: res => {
          this.setData({
            list: res.data.datas.list
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
/* addons/pages/tsMySubordinates/tsMySubordinates.wxss */
.thead{
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 88rpx;
  background-color: #F2F1F6;
  color: #373737;
  font-size: 30rpx;
}

.thead .th,.tbody .td{
  flex: 1;
  text-align: center;
}

.tbody .tr{
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 73rpx;
  color: #5C5C5C;
  font-size: 28rpx;
}

.wrap{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.empty{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty image{
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 30rpx;
}

.empty text{
  color: #666;
  font-size: 26rpx;
}

</style>