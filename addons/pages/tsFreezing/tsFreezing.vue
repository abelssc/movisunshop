<template>
<view>
<tsCommon></tsCommon>

<view class="amount">
  <view class="amountBg">
    <image :src="img_url+$L('tsbg.png')"></image>
  </view>
  <view class="title">{{$L('冻结金额明细')}}</view>
  <view class="money">{{memberInfo.freeze_yongjin}}</view>
</view>

<view class="order-list" v-if="orderList.length">
  <view v-for="(item, index) in orderList" :key="index" class="order-item">
    <view class="order-item-left">
      <text class="order-sn">{{$L('订单号：')}}{{item.order_sn}}</text>
      <text class="order-time">{{item.add_time_str}}</text>
    </view>
    <view class="order-item-right">
      <text>+{{item.yj_amount}}{{$L('元')}}</text>
    </view>
  </view>
</view>

<view class="list" v-if="PdcashList.length">
  <view v-for="(item, index) in PdcashList" :key="index" class="item">
    <view class="item-left">
      <image :src="img_url+'addons/txicon.png'"></image>
      <view class="tx-txt">
        <text>{{$L('提现')}}</text>
        <text>{{item.pdc_add_time}}</text>
      </view>
    </view>

    <view class="item-right">
      <view :class="'pdc-amount ' + (item.pdc_payment_state==1?'settlement':(item.pdc_payment_state==0?'freeze':'failure'))">+{{item.pdc_amount}}</view>
      <view class="pdc-state">{{item.pdc_payment_state_desc}}</view>
    </view>
  </view>
</view>


<view class="empty" v-if="!orderList.length && !PdcashList.length && isLoading">
  <image :src="img_url+'addons/txempty.png'"></image>
  <text>{{$L('暂无数据')}}</text>
</view>

<common :title="$L('冻结金额明细')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      ssys_key: '',
      PdcashList: [],
      orderList: [],
      isLoading: false,
      img_url: getApp().globalData.img_url, //图片地址
      memberInfo: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('冻结金额明细')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key: ssys_key
    });
    this.initData();
  },
  onReachBottom: function () {
    if (this.l_hasmore) {
      this.getOrderList();
    }

    if (this.p_hasmore) {
      this.getPdcashList();
    }
  },
  methods: {
    initData() {
      this.getMemberInfo();
      this.getOrderList();
      this.getPdcashList();
    },

    getMemberInfo() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberInfo&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key
        },
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              memberInfo: res.data.datas.member_info
            });
          }
        }
      });
    },

    getOrderList() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_list&sld_addons=spreader&page=10&pn=' + this.l_pn,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key,
          yj_state: 0
        },
        success: res => {
          if (res.data.code == 200) {
            let order_group_list = res.data.datas.order_group_list;

            if (order_group_list && order_group_list.length) {
              if (this.l_pn == 1) {
                this.setData({
                  orderList: order_group_list
                });
              } else {
                let {
                  orderList
                } = this;
                this.setData({
                  orderList: orderList.concat(order_group_list)
                });
              }
            }

            if (res.data.hasmore) {
              this.l_pn++;
            } else {
              this.l_hasmore = false;
            }
          }
        },
        complete: () => {
          if (!this.isLoading) {
            this.setData({
              isLoading: true
            });
          }
        }
      });
    },

    getPdcashList() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=ssys_cash&mod=pdcashlist&sld_addons=spreader&page=10&pn=' + this.p_pn,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key,
          cash_state: 'i'
        },
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.list;

            if (list && list.length) {
              if (this.p_pn == 1) {
                this.setData({
                  PdcashList: list
                });
              } else {
                let {
                  PdcashList
                } = this;
                this.setData({
                  PdcashList: PdcashList.concat(list)
                });
              }
            }

            if (res.data.hasmore) {
              this.p_pn++;
            } else {
              this.p_hasmore = false;
            }
          }
        }
      });
    }

  }
};
</script>
<style>
@import "../../templates/wxss/common.css";
page{
	width: 750rpx;
	margin: 0 auto;
}
</style>