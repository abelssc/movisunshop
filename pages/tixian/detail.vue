<template>
<view>
<view class="tixian">
  <view class="list">{{$L('申请单号：')}}{{info.pdc_sn}}</view>
  <view class="list">{{$L('提现金额：')}}{{info.pdc_amount}}元</view>
  <view class="list">{{$L('手续费：')}}{{info.pdc_payment_fee}}元</view>
  <view class="list">{{$L('收款方式：')}}{{info.pdc_bank_name}}</view>
  <view class="list" v-if="info.pdc_bank_name != $L('微信')">{{$L('收款账号：')}}{{info.pdc_bank_no}}</view>
  <view class="list">{{$L('账户姓名：')}}{{info.pdc_bank_user}}</view>
  <view class="list">{{$L('申请时间：')}}{{info.pdc_add_time_str}}</view>
  <view class="list">{{$L('提现状态：')}}
    <text :class="(info.pdc_payment_state==0?'ye':'') + ' ' + (info.pdc_payment_state==1?'bl':'') + ' ' + (info.pdc_payment_state==-1?'red':'')">{{info.pdc_payment_state_desc}}</text>
  </view>
  <view class="list" v-if="info.pdc_payment_state==-1">{{$L('失败原因：')}}{{info.pdc_refuse_desc}}</view>
</view>
<common :title="$L('提现详情')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      id: '',
      info: ''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('提现详情')
    });
    let id = options.id;

    if (id) {
      this.setData({
        id: id
      });
    }

    this.getdetail();
  },
  methods: {
    getdetail() {
      let that = this,
          id = that.id,
          key = uni.getStorageSync('token');
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=cash&mod=getCashApplyLogInfo&key=' + key,
        method: 'GET',
        data: {
          id: id
        },

        success(res) {
          that.setData({
            info: res.data.data
          });
        },

        error: function (err) {}
      });
    }

  }
};
</script>
<style>
.tixian{
  width: 750rpx;
  height: calc(100vh - 30rpx);
  padding-top: 30rpx;
  background-color: #f5f5f5;
}

.list{
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 60rpx;
  word-break: break-all;
}

.list text{
  color: #F5A623;
}

.list .ye {
  color: #f5a623;
}

.list .bl {
  color: #62a315;
}

.list .red {
  color: #fd5375;
}

</style>