<template>
<view>
<!--integral/pages/wait_pay/wait_pay.wxml-->
<view class="order">
  <view class="order_top">
    <view class="img">
      <image :src="img_url+'integral/order2.png'" mode="widthFix"></image>
    </view>
    <view>
      <text>{{orderInfo.order_state}}</text>
      <text>{{order_status_text}}</text>
      <text v-if="orderInfo.point_orderstate==11||orderInfo.point_orderstate==20">{{orderInfo.point_addtimes}}</text>
    </view>
  </view>

  <view class="addr">
    <view>
      <text>{{address.point_truename}}</text>
      <text>{{address.point_mobphone}}</text>
    </view>
    <view>
      <text>{{address.point_areainfo}}</text>
      <text>{{address.point_address}}</text>
    </view>
  </view>

  <view class="order_list">
    <view v-for="(item, index) in orderInfo.order_goods" :key="index" class="item" :data-gid="item.point_goodsid" @tap="detail">
      <view class="img">
        <image :src="item.image"></image>
      </view>
      <view class="info">
        <text>{{item.point_goodsname}}</text>
        <text>{{$L('数量')}}</text>
      </view>
      <view class="info price">
        <text>{{item.point_goodspoints}}{{$L('积分')}}</text>
        <text>X{{item.point_goodsnum}}</text>
      </view>
    </view>
  </view>

  <view class="order_info">
    <view class="wrap">
      <view class="first">
        <text>{{$L('商品合计')}}</text>
        <text>{{orderInfo.point_allpoint}}{{$L('积分')}}</text>
      </view>
      <view class="first">
        <text>{{$L('运费')}}</text>
        <text>{{orderInfo.point_shippingcharge==1?orderInfo.point_shippingfee : $L('免费')}}</text>
      </view>
    </view>

    <view class="last">
      <text>{{$L('合计应付: ')}}{{orderInfo.point_allpoint}}{{$L('积分')}}</text>
    </view>

    <view class="order_time">
      <view>
        <view>{{$L('订单号：')}}{{orderInfo.point_ordersn}}</view>
        <view>{{$L('下单时间：')}}{{orderInfo.point_addtimes}}</view>
      </view>
      <view class="copy" v-if="orderInfo.point_orderstate!=2" :data-sn="orderInfo.point_ordersn" @tap="copy">{{$L('复制')}}</view>
    </view>
  </view>

  <view class="footer">
    <view v-if="orderInfo.point_orderstate==10||orderInfo.point_orderstate == 11 || orderInfo.point_orderstate == 20" :data-id="orderInfo.point_orderid" @tap="cancelOrder">{{$L('取消订单')}}</view>
    <view class="red_btn" v-if="orderInfo.point_orderstate==10" :data-id="orderInfo.point_orderid" @tap="pay">{{$L('去兑换')}}</view>
    <view class="red_btn" v-if="orderInfo.point_orderstate != 10" :data-id="orderInfo.point_orderid" @tap="rebuy">{{$L('再次兑换')}}</view>
    <view class="g_btn" v-if="orderInfo.point_orderstate == 30" :data-id="orderInfo.point_orderid" @tap="confirmSh">{{$L('确认收货')}}</view>
  </view>
</view>

<common :title="$L('订单详情')"></common>
</view>
</template>

<script>
import { cancelOrder, rebuy, confirmSh, pay } from "../../common/common";
import { setClipboardData, getClipboardData } from '@/component/u-clipboard'
export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      order_status_text: '',
      // 订单状态文字
      order_id: '',
      // 订单id
      orderInfo: '',
      key: '',
      address: '',
      orderList: []
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('订单详情')
    });
    let id = options.id;
    let key = uni.getStorageSync('token');
    this.setData({
      order_id: id,
      key: key
    });
    this.getOrderInfo();
  },
  methods: {
    // 获取订单详情
    getOrderInfo() {
      let that = this,
          key = that.key,
          order_id = that.order_id;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_desc&sld_addons=points',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          key,
          order_id
        },
        success: function (res) {

          if (res.data.status == 200) {
            let status = res.data.data.orderinfo.point_orderstate;
            let text = '';

            if (status == 20 || status == 11) {
              text = that.$L('您的订单已付款，我们会尽快为您安排发货');
            } else if (status == 40 || status == 50) {
              text = that.$L('您的订单完成!');
            } else if (status == 10) {
              text = that.$L('您的订单已提交，请在' + res.data.data.orderinfo.point_invalidtime + '内支付完成,超时订单自动取消 ...');
            } else if (status == 2) {
              text = that.$L('订单已取消');
            } else if (status == 30) {
              text = that.$L('您的订单已发货，请注意留意物流信息及时收货，\n运单号码：')+ res.data.data.orderinfo.point_shippingcode +'';
            }

            that.setData({
              orderInfo: res.data.data.orderinfo,
              address: res.data.data.address,
              order_status_text: text
            });
          }
        }
      });
    },

    //复制订单号
    copy(e) {
      let that = this
      let sn = e.currentTarget.dataset.sn;
	  setClipboardData(sn).then(res=>{
		 uni.showToast({
		   title: that.$L('复制成功'),
		   // icon: 'none'
		 });
	  })
	  
      // setClipboardData({
      //   text: sn,
      //   resolve : function (res) {
      //     uni.getClipboardData({
      //       success: function (res) {}
      //     });
      //   }
      // });
    },

    cb() {
      let that = this;
      that.pn = 1;
      that.hasmore = true;
      that.setData({
        orderList: []
      });
      that.getOrderInfo();
    },

    // 取消订单
    cancelOrder(e) {
      cancelOrder(e, this, this.cb);
    },

    // 再次购买
    rebuy(e) {
      rebuy(e, this);
    },

    // 确认收货
    confirmSh(e) {
      let that = this;
      confirmSh(e, this, this.cb);
    },

    // 去兑换
    pay(e) {
      pay(e, this, this.cb);
    },

    // 查看商品详情
    detail(e) {
      let gid = e.currentTarget.dataset.gid;

      if (gid) {
        uni.navigateTo({
          url: '/integral/pages/goods_detail/goods_detail?gid=' + gid
        });
      }
    }

  }
};
</script>
<style>
/* integral/pages/wait_pay/wait_pay.wxss */

.order {
  min-height: calc(100vh - 140rpx);
  padding: 20rpx 0 120rpx;
  background-color: #f5f5f5;
  width: 750rpx;
  margin: 0 auto;
}

.order_top {
  display: flex;
  background-color: #cae6f4;
  padding: 30rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.order_top .img {
  width: 73rpx;
  margin-right: 20rpx;
}

.order_top .img image {
  width: 100%;
}

.order_top text {
  display: block;
}

.order_top view text:nth-child(1) {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.order_top view text:nth-child(2), .order_top view text:nth-child(3) {
  font-size: 26rpx;
  color: #666;
}

.addr {
  padding: 38rpx 30rpx;
  background-color: #fffcef;
  font-size: 28rpx;
  color: #565656;
  margin-bottom: 20rpx;
}

.addr view:nth-child(1) {
  font-size: 34rpx;
  color: #181818;
  margin-bottom: 10rpx;
}

.addr view:nth-child(1) text:first-child {
  margin-right: 30rpx;
}

.addr view:nth-child(2) text:first-child {
  margin-right: 15rpx;
}

.order_list {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding-left: 30rpx;
}

.item {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 30rpx 30rpx 0;
  border-bottom: 1rpx solid #dadada;
}

.item:last-child {
  border: none;
}

.item .img {
  flex: 0 0 140rpx;
  width: 140rpx;
  height: 140rpx;
  margin-right: 30rpx;
  border: 1rpx solid #f6f6f6;
}

.item .img image {
  width: 100%;
  height: 100%;
}

.item .info:nth-child(2) {
  flex: 1;
  padding-right: 30rpx;
}

.item .info:nth-child(2) text {
  width: 320rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.info text {
  display: block;
  color: #5e5e5e;
  font-size: 28rpx;
}

.info text:nth-child(1) {
  font-size: 32rpx;
  margin-bottom: 20rpx;
  color: #181818;
}

.price {
  text-align: right;
}

.price text:nth-child(1) {
  font-size: 28rpx;
  font-weight: 600;
}

.price text:nth-child(2) {
  color: #181818;
  font-size: 32rpx;
}

.order_info {
  background-color: #fff;
  padding: 0 30rpx;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.order_info .wrap {
  padding: 30rpx 0;
}

.order_info .first {
  display: flex;
  justify-content: space-between;
  padding-bottom: 30rpx;
  color: #181818;
}

.order_info .first:last-child {
  padding-bottom: 0;
}

.order_info .last {
  height: 110rpx;
  line-height: 110rpx;
  border-top: 1rpx solid #e2e2e2;
  color: #c31c1c;
  text-align: right;
}

.footer {
  position: fixed;
  bottom: 0;
  /* width: 100%; */
  width: 750rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 120rpx;
  /* border-top: 1rpx solid #cdcdcd; */
  box-shadow: 0 0 2rpx #ccc;
  background-color: #fff;
  z-index: 9;
}

.footer view {
  display: block;
  margin: 0 30rpx 0 0;
  width: 190rpx;
  height: 72rpx;
  border: 1rpx solid #707070;
  border-radius: 12rpx;
  background-color: #fff;
  outline: none;
  color: #181818;
  font-size: 32rpx;
  line-height: 72rpx;
  text-align: center;
}

.cancel {
  color: #3c3c3c;
  border-left: 1rpx solid #d2d2d2;
}

.confirm {
  background-color: #e32222;
}

.order_time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 30rpx;
  line-height: 50rpx;
  padding: 20rpx 0;
}

.order_time .copy {
  width: 110rpx;
  height: 60rpx;
  border: 1rpx solid #707070;
  border-radius: 8rpx;
  line-height: 60rpx;
  text-align: center;
}

.footer .g_btn {
  background-color: #ed3736;
  color: #fff;
  border-color: #ed3736;
}

.footer .red_btn {
  background-color: #ed3736;
  color: #fff;
  border-color: #ed3736;
}

</style>