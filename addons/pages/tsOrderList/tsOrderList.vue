<template>
<view>
<!--addons/pages/tsOrderList/tsOrderList.wxml-->
<DiyTabBar :tabBar="tabBar"></DiyTabBar>
<tsCommon></tsCommon>

<view class="orderlist">
  <view v-for="(item, index) in orderList" :key="index" class="order-item" v-if="orderList.length">
    <view class="item-left">
      <text>{{$L('订单号')}}: {{item.order_sn}}</text>
      <text>{{$L('订单状态')}}: {{item.state_desc}}</text>
      <text>{{$L('下单时间')}}:  {{item.add_time_str}}</text>
    </view>

    <view class="item-right">
      <text>{{$L('付款金额')}}:  {{item.order_amount}}</text>
      <text>{{$L('佣金')}}:  {{item.yj_amount}}</text>
      <text class="yj-status">{{$L('佣金状态')}}: <text :class="item.yj_status==0?'y':(item.yj_status==1?'b':'r')">{{item.yj_status_desc}}</text></text>
    </view>
  </view>

  <view class="empty" v-if="!orderList.length">
    <image :src="img_url+'addons/no-data.png'" mode="widthFix"></image>
    <view>{{$L('暂无数据')}}</view>
  </view>
</view>

<common :title="$L('订单明细')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      tabBar: {
        // tabBar 配置
        color: "#5C5C5C",
        // 文字颜色
        selectedColor: "#091552",
        // 选中的颜色
        selectItem: 1,
        list: [{
          pagePath: "/addons/pages/tsIndex/tsIndex",
          text: this.$L('必推好货'),
          iconPath: getApp().globalData.img_url + "ts/ts1.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts11.png"
        }, {
          pagePath: "/addons/pages/tsOrderList/tsOrderList",
          text: this.$L('订单明细'),
          iconPath: getApp().globalData.img_url + "ts/ts2.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts22.png"
        }, {
          pagePath: "/addons/pages/tsUserCenter/tsUserCenter",
          text: this.$L('推手中心'),
          iconPath: getApp().globalData.img_url + "ts/ts3.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts33.png"
        }]
      },
      orderList: [],
      ssys_key: '',
      img_url: getApp().globalData.img_url //图片地址

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('订单明细')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key
    });
    this.getOrderList();
  },
  onReachBottom: function () {
    if (this.hasmore) {
      this.getOrderList();
    }
  },
  methods: {
    getOrderList() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_list&sld_addons=spreader&page=' + 10 + '&pn=' + this.pn,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key
        },
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.order_group_list;

            if (this.pn == 1) {
              this.setData({
                orderList: list
              });
            } else {
              let {
                orderList
              } = this;
              this.setData({
                orderList: orderList.concat(list)
              });
            }

            if (res.data.hasmore) {
              this.pn++;
            } else {
              this.hasmore = false;
            }
          }
        }
      });
    }

  }
};
</script>
<style>
/* addons/pages/tsOrderList/tsOrderList.wxss */

page {
  padding-bottom: 100rpx;
  background-color: #f7f8fb;
}

.orderlist {
  min-height: calc(100vh - 98rpx);
  padding: 0 20rpx;
  width: 750rpx;
  margin: 0 auto;
  box-sizing: border-box;
}

.orderlist .order-item {
  display: flex;
  height: 205rpx;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  color: #616161;
  font-size: 26rpx;
  margin-top: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  box-shadow: 1px 1px 20px 1px #dde1ed;
}

.orderlist .order-item text {
  display: block;
}

.orderlist .order-item text:nth-child(2) {
  margin: 25rpx 0;
}

.orderlist .yj-status text {
  display: inline;
}

.y{
  color: #EF8D01;
}

.b{
  color: #38A30E;
}

.r{
  color: #FC3357;
}

.empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20vh 0;
}

.empty image{
  width: 160rpx;
  height: 0;
}

.empty view{
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}
</style>