<template>
<view>
<view class="list" v-if="list && list.length">
  <view v-for="(item, index) in list" :key="index" class="item">
    <view class="name">{{item.member_name}}</view>
    <view class="info">
      <text>{{item.grade_level}}</text>
      <text class="time">{{item.regester_time}}</text>
    </view>
  </view>
</view>

<view class="empty" v-else>
    <view class="img">
      <image :src="img_url+'mcc_04_w.png'" mode="widthFix"></image>
    </view>
    <view class="tip">{{$L('您还没有推广会员哦')}}</view>
    <text>{{$L('快快推广吧')}}</text>
</view>

<common :title="$L('团队列表')"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      key: '',
      type: "",
      list: []
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('团队列表')
    });
    var key = uni.getStorageSync('token');
    var type = options.type;

    if (key) {
      this.setData({
        key: key,
        type
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.initData();
  },
  methods: {
    initData() {
      let {
        key,
        type
      } = this;
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=childListInfo&key=' + key + '&type=' + type + '&pn=1&page=10'
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            list: res.datas.member_info
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
  height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
}

.list{
  background-color: #fff;
}

.list .item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 120rpx;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #e2e2e2;
}

.list .item:last-child{
  border-bottom: 0;
}

.item .name{
  color: #232326;
  flex: 1;
  font-size: 26rpx;
}

.item .info{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.info text{
  color: #f23030;
  font-size: 26rpx;
}

.info .time{
  color: #848689;
  font-size: 24rpx;
  margin-top: 20rpx;
}

.empty{
  display: flex;
  width: 750rpx;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty .img{
  width: 140rpx;
  height: 140rpx;
  background-color: #DDD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty .img image{
  width: 100rpx;
  height: 100rpx;
}

.empty .tip{
  color: #000;
  font-size: 30rpx;
  margin: 30rpx 0;
}

.empty text{
  font-size: 26rpx;
  color: #999;
}
</style>