<template>
<view>
<tsCommon></tsCommon>

<view class="amount">
  <view class="amountBg">
    <image :src="img_url+$L('tsbg.png')"></image>
  </view>
  <view class="title">{{$L('可提现金额明细')}}</view>
  <view class="money">{{memberInfo.available_yongjin}}</view>
  <navigator url="/addons/pages/tsWithdrawal/tsWithdrawal" hover-class="none" class="txBtn">{{$L('提现')}}</navigator>
</view>

<view class="nav">
  <view class="nav-sel" @tap="showNav">
    <text>{{navSel}}</text>
    <image src="/static/addons/images/ltr.png"></image>
  </view>
  <view class="nav-wrap" :hidden="!show">
    <text v-for="(item, index) in navData" :key="index" :data-id="item.id" :data-name="item.name" @tap="selNav">{{item.name}}</text>
  </view>
</view>

<view class="list" v-if="amountList.length">
  <view v-for="(item, index) in amountList" :key="index" class="item">
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

<view class="empty" v-if="!amountList.length && isLoading">
  <image :src="img_url+'addons/txempty.png'"></image>
  <text>{{$L('暂无数据')}}</text>
</view>

<common :title="$L('可提现金额明细')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      ssys_key: '',
      memberInfo: '',
      amountList: [],
      navData: [{
        name: this.$L('全部'),
        id: ''
      }, {
        name: this.$L('提现成功'),
        id: 's'
      }, {
        name: this.$L('提现失败'),
        id: 'f'
      }, {
        name: this.$L('正在审核'),
        id: 'i'
      }],
      navSel: this.$L('全部'),
      cash_state: '',
      isLoading: false,
      img_url: getApp().globalData.img_url //图片地址
      ,
      show: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('可提现金额明细')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key: ssys_key
    });
    this.getMemberInfo();
    this.getPdCashList();
  },

  onReachBottom() {
    if (this.hasmore) {
      this.getPdCashList();
    }
  },

  methods: {
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

    getPdCashList() {
      const {
        ssys_key,
        cash_state
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + `/index.php?app=ssys_cash&mod=pdcashlist&sld_addons=spreader&page=10&pn=${this.pn}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key,
          cash_state: cash_state
        },
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.list;

            if (list.length) {
              if (this.pn == 1) {
                this.setData({
                  amountList: list
                });
              } else {
                let {
                  amountList
                } = this;
                this.setData({
                  amountList: amountList.concat(list)
                });
              }
            }

            if (res.data.hasmore) {
              this.pn++;
            } else {
              this.hasmore = false;
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

    // 显示分类
    showNav() {
      this.setData({
        show: true
      });
    },

    // 切换分类
    selNav(e) {
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.dataset.name;
      this.setData({
        cash_state: id,
        show: false,
        navSel: name,
        amountList: []
      });
      this.pn = 1;
      this.hsamore = true;
      this.getPdCashList();
    },

    updateData() {
      this.pn = 1;
      this.hsamore = true;
      this.getPdCashList();
    }

  }
};
</script>
<style>
@import "../../templates/wxss/common.css";
page{
  padding-top: 470rpx;
}

.nav{
  position: fixed;
  top: 414rpx;
  left: 0;
  width: 750rpx;
  height: 80rpx;
  box-sizing: border-box;
  text-align: right;
  color: #5C5C5C;
  font-size: 26rpx;
  padding: 52rpx 0 15rpx 0;
  background-color: #fff;
}

.nav .nav-sel{
  position: absolute;
  top: 32rpx;
  right: 20rpx;
  display: flex;
  align-items: center;
}

.nav .nav-sel image{
  width: 11rpx;
  height: 20rpx;
  margin-left: 20rpx;
  transform: rotate(90deg);
}

.nav .nav-wrap{
  position: absolute;
  top: 76rpx;
  right: 21rpx;
  width: 114rpx;
  line-height: 42rpx;
  text-align: center;
  background-color: rgba(0,0,0,.8);
  color: #DEDEDE;
  font-size: 24rpx;
  padding: 10rpx 0;
  border-radius: 5rpx;
}

.nav .nav-wrap text{
  display: block;
}

</style>