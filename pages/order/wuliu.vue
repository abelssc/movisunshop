<template>
<view>
<view class="deliver">
  <view class="express">
    <image :src="pic" mode="widthFix"></image>
    <view class="express-info">
      <view class="company">{{$L('物流公司：')}}{{express_name}}</view>
      <view class="order-sn">{{$L('运单号码：')}}{{shipping_code}}</view>
    </view>
  </view>

  <view class="deliver-list" v-if="deliver_info && deliver_info.length">
    <view v-for="(item, index) in deliver_info" :key="index" :class="'item ' + (index==0?'on':'')">
      <view class="dot"></view>
      <view class="line"></view>
      <view class="content">{{item}}</view>
    </view>
  </view>

  <view class="deliver-bottom">
    <view>{{$L('以上部分信息来自于第三方，仅供参考')}}</view>
    <view>{{$L('如需准确信息可联系卖家或物流公司')}}</view>
  </view>

</view>

<common :title="$L('物流信息')"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      order_id: '',
      key: ''
    };
  },

  components: {},
  props: {},
  onLoad: function (option) {
    uni.setNavigationBarTitle({
        title: this.$L('物流信息')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.setData({
      order_id: option.u
    });
    this.initData();
  },
  methods: {
    initData() {
      let {
        order_id,
        key
      } = this;
      request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=search_deliver',
        method: 'post',
        data: {
          key,
          order_id
        }
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
/* pages/order/wuliu.wxss */

page {
  background-color: #f5f5f5;
  width: 750rpx;
  margin: 0 auto;
}

.deliver {
  background-color: #fff;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}

.deliver .express {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}

.express image {
  width: 50rpx;
  height: 0;
}

.express .express-info {
  flex: 1;
  margin-left: 40rpx;
}

.express-info .company {
  color: #232326;
  font-size: 28rpx;
  line-height: 40rpx;
}

.express-info .order-sn {
  color: #848689;
}

.deliver-bottom {
  text-align: center;
  margin-top: 50rpx;
  font-size: 24rpx;
  line-height: 36rpx;
}

.deliver-list {
  padding: 20rpx 0 20rpx 120rpx;
}

.deliver-list .item {
  position: relative;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666;
  border-bottom: 1rpx solid #EEE;
}

.deliver-list .item.on{
  color: #30cb42;
}

.item .dot{
  position: absolute;
  top: 36rpx;
  left: -55rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #F30213;
  z-index: 9;
}

.item.on .dot{
  left: -64rpx;
  background-color: #30cb42;
  border: 8rpx solid #a5edad;
}

.item .line{
  position: absolute;
  left: -49rpx;
  top: 44rpx;
  width: 1rpx;
  height: 100%;
  background-color: #CCC;
}

.item.on .line{
  background-color: #a5edad;
}

.item:last-child .line{
  display: none;
}
</style>