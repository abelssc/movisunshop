<template>
<view>
<!--<import src="../template/not.wxml"></import>-->
<footerBar :imgSrc="imgSrc" />

<view class="my_order">
  <view class="nav">
    <text data-s="1" :class="s=='1'?'on':''" @tap="changeNav">{{$L('全部')}}</text>
    <text data-s="10" :class="s=='10'?'on':''" @tap="changeNav">{{$L('待兑换')}}</text>
    <text data-s="20" :class="s=='20'?'on':''" @tap="changeNav">{{$L('待发货')}}</text>
    <text data-s="30" :class="s=='30'?'on':''" @tap="changeNav">{{$L('待收货')}}</text>
    <text data-s="40" :class="s=='40'?'on':''" @tap="changeNav">{{$L('兑换成功')}}</text>
  </view>

  <scroll-view scroll-y @scrolltolower="getmore">
    <block v-if="orderList.length">
      <view v-for="(item, index) in orderList" :key="index" class="list">
        <view class="state" :data-id="item.point_orderid" @tap="details">{{item.order_state}}</view>
        <view :data-id="item.point_orderid" @tap="details">
          <view v-for="(goods, index2) in item.order_goods" :key="index2" class="item">
            <view class="img">
              <image :src="goods.image"></image>
            </view>
            <view class="info">
              <text>{{goods.point_goodsname}}</text>
            </view>
            <view class="info price">
              <text>{{goods.point_goodspoints}}{{$L('积分')}}</text>
              <text>X{{goods.point_goodsnum}}</text>
            </view>
          </view>
        </view>

        <view class="handle">
          <view class="num">
            <text>{{$L('共')}}{{item.goods_number}}{{$L('件')}}</text>
            <view>{{$L('应付：')}}
              <text>{{item.point_allpoint}}{{$L('积分')}}</text>
            </view>
          </view>
          <view class="btn">
            <view v-if="item.point_orderstate==10||item.point_orderstate == 11 || item.point_orderstate == 20" :data-id="item.point_orderid" @tap="cancelOrder">{{$L('取消订单')}}</view>
            <view class="red_btn" v-if="item.point_orderstate==10" :data-id="item.point_orderid" @tap="pay">{{$L('去兑换')}}</view>
            <view class="red_btn" v-if="item.point_orderstate != 10&&item.point_orderstate != 2" :data-id="item.point_orderid" @tap="rebuy">{{$L('再次兑换')}}</view>
            <view class="red_btn" v-if="item.point_orderstate == 30" :data-id="item.point_orderid" @tap="confirmSh">{{$L('确认收货')}}</view>
          </view>
        </view>
      </view>
    </block>
    <block v-else>
      <block data-type="template" data-is="not" data-attr="img,content">
  <view class="nothasData">
    <view class="img">
      <image :src="img"></image>
    </view>
    <text>{{content}}</text>
  </view>
</block>
    </block>
  </scroll-view>
</view>

<common :title="$L('我的订单')"></common>
</view>
</template>

<script>
import footerBar from "@/integral/pages/template/footer.vue";
import { cancelOrder, rebuy, confirmSh, pay } from "../../common/common";

export default {
	components: {
		footerBar,
	},
  data() {
    return {
      imgSrc: 'order',
      key: '',
      s: '1',
      // 订单类型
      orderList: [],
      // 订单列表 
      img: getApp().globalData.img_url+"no_order_list.png",
      content: this.$L('暂无数据...')
    };
  },

  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('积分订单')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    if (options.order) {
      this.setData({
        s: options.order
      });
    }

    this.getOrderList();
  },
  methods: {
    jumpPage(e) {
      let url = e.currentTarget.dataset.url;

      if (url) {
        uni.redirectTo({
          url
        });
      }
    },

    // 切换
    changeNav(e) {
      let s = e.currentTarget.dataset.s;
      let olds = this.s;

      if (s != olds) {
        this.setData({
          s,
          orderList: []
        });
        this.pn = 1;
        this.hasmore = true;
        this.getOrderList();
      }
    },

    // 获取订单列表
    getOrderList() {
      let that = this,
          key = that.key,
          s = that.s;
      uni.showLoading({
        title: that.$L('加载中...')
      });
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=getmemberlist&sld_addons=points',
        method: 'GET',
        data: {
          key,
          s,
          page: 10,
          pn: that.pn
        },
        success: function (res) {
          if (res.data.status == 200) {
            if (res.data.data.list) {
              that.setData({
                orderList: that.orderList.concat(res.data.data.list)
              });
            }

            if (res.data.data.ishasmore.hasmore) {
              that.pn++;
            } else {
              that.hasmore = false;
            }
          }
        },
        error: function (err) {
        },
        complete: function () {
          uni.hideLoading();
        }
      });
    },

    // 加载更多
    getmore() {
      if (this.hasmore) {
        this.getOrderList();
      }
    },

    cb() {
      let that = this;
      that.pn = 1;
      that.hasmore = true;
      that.setData({
        orderList: []
      });
      that.getOrderList();
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

    // 查看订单详情
    details(e) {
      let id = e.currentTarget.dataset.id;

      if (id) {
        uni.navigateTo({
          url: '/integral/pages/wait_pay/wait_pay?id=' + id
        });
      }
    }

  }
};
</script>
<style>
/* integral/pages/my_order/my_order.wxss */
page{
	width: 750rpx;
	margin: 0 auto;
}
.my_order {
  min-height: calc(100vh - 100rpx);
  padding-bottom: 100rpx;
  background-color: #f5f5f5;
  width: 750rpx;
  margin: 0 auto;
}

.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  color: #181818;
  background-color: #fff;
}

.nav .on {
  color: #e27600;
  border-bottom: 4rpx solid #ec3737;
}

.nav text {
  display: block;
  padding: 0 20rpx;
  border-bottom: 4rpx solid transparent;
}

scroll-view {
  height: calc(100vh - 214rpx);
  padding-top: 20rpx;
  overflow: hidden;
}

.list {
  background-color: #fff;
  margin-bottom: 10rpx;
  padding-left: 30rpx;
  overflow: hidden;
}

.list .state {
  height: 80rpx;
  line-height: 80rpx;
  border-bottom: 1rpx solid #e9e9e9;
  color: #e32222;
  font-size: 28rpx;
  text-align: right;
  padding-right: 30rpx;
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

.handle {
  padding-right: 30rpx;
  border-top: 1rpx solid #e9e9e9;
}

.handle .num {
  padding: 30rpx 0;
  font-size: 32rpx;
  color: #181818;
  text-align: right;
}

.num view {
  display: inline;
}

.num  view text {
  color: #e32222;
}

.handle .btn {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 30rpx;
}

.btn view {
  width: 190rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 4rpx;
  text-align: center;
  font-size: 30rpx;
  border: 1rpx solid #707070;
  margin: 0;
  margin-left: 30rpx;
  color: #181818;
  background-color: #fff;
}

.btn .red_btn {
  color: #fff;
  background-color: #ec3737;
  border-color: #ec3737;
}

</style>