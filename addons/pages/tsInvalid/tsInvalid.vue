<template>
<view>
<tsCommon></tsCommon>

<view class="amount">
  <view class="amountBg">
    <image :src="img_url+$L('tsbg.png')"></image>
  </view>
  <view class="title">{{$L('失效金额明细')}}</view>
  <view class="money">{{memberInfo.disable_yongjin}}</view>
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

<view class="empty" v-if="!orderList.length && isLoading">
  <image :src="img_url+'addons/txempty.png'"></image>
  <text>{{$L('暂无数据')}}</text>
</view>

<common :title="$L('失效金额明细')"></common>
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
      img_url: getApp().globalData.img_url //图片地址
      ,
      memberInfo: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('失效金额明细')
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
  },
  methods: {
    initData() {
      this.getMemberInfo();
      this.getOrderList();
    },

    getMemberInfo() {
      const {
        ssys_key
      } = this;
      uni.request({
        url:getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberInfo&sld_addons=spreader',
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
          yj_state: -1
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
    }

  }
};
</script>
<style>
@import "../../templates/wxss/common.css";
</style>