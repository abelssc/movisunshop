<template>
<view>
<view class="refund">
  <view class="item">
    <view class="title">{{type==1?$L('我的退款申请'):$L('我的退货申请')}}</view>
    <view class="info">
      <view class="list">
        <text>{{$L('订单编号')}}</text>
        <text>{{info.order_sn}}</text>
      </view>
      <view class="list">
        <text>{{type==1?$L('退款编号'):$L('退货编号')}}</text>
        <text>{{info.refund_sn}}</text>
      </view>
      <view class="list">
        <text>{{type==1?$L('退款原因'):$L('退货原因')}}</text>
        <text class="reason_text">{{info.buyer_message}}</text>
      </view>
      <view class="list">
        <text>{{type==1?$L('退款金额'):$L('退货金额')}}</text>
        <text>{{info.refund_amount}}</text>
      </view>
    </view>
  </view>

  <view class="item">
    <view class="title">{{type==1?$L('商家退款处理'):$L('商家退货处理')}}</view>
    <view class="info">
      <view class="list">
        <text>{{$L('申请状态')}}</text>
        <text>{{info.seller_state}}</text>
      </view>
      <view class="list">
        <text>{{$L('商家备注')}}</text>
        <text>{{info.seller_message?info.seller_message:''}}</text>
      </view>
    </view>
  </view>

  <view class="item">
    <view class="title">{{type==1?$L('商城退款审核'):$L('商城退货审核')}}</view>
    <view class="info">
      <view class="list">
        <text>{{$L('平台确认')}}</text>
        <text>{{info.admin_state}}</text>
      </view>
      <view class="list">
        <text>{{$L('平台备注')}}</text>
        <text>{{info.admin_message?info.admin_message:''}}</text>
      </view>
    </view>
  </view>

  <view class="item" v-if="info.express_name">
    <view class="title">{{$L('发货信息')}}</view>
    <view class="info">
      <view class="list">
        <text>{{$L('物流公司')}}</text>
        <text>{{info.express_name}}</text>
      </view>
      <view class="list">
        <text>{{$L('物流单号')}}</text>
        <text>{{info.invoice_no}}</text>
      </view>
    </view>
  </view>
</view>

<common :title="$L('退款详情')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      info: '',
      refund_id: '',
	  type:''
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('退款详情')
    });
    let key = uni.getStorageSync('token');

    if (options.id) {
      this.setData({
        key,
        refund_id: options.id,
		type:options.type
      });
    }
   
    this.getinfo();
  },
  methods: {
    getinfo() {
      let that = this;
      let key = that.key;
      let refund_id = that.refund_id;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=get_refund_info',
        method: 'GET',
        data: {
          key,
          refund_id
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              info: res.data.datas.refund
            });
          }
        }
      });
    }

  }
};
</script>
<style>
/* pages/refund/refund.wxss */
.refund{
  width: 750rpx;
  background-color: #efefef;
  margin: 0 auto;
}

.refund .item{
  margin-bottom: 30rpx;
  background-color: #fff;
  font-size: 26rpx;
  color: #666;
}

.item .title{
  font-size: 28rpx;
  color: #333;
  line-height: 80rpx;
  padding-left: 20rpx;
}

.info{
  padding: 0 30rpx;
}

.info .list{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70rpx;
}

.info .list text:first-child{
  color: #333;
}
.reason_text{
	width: 76%;
	text-align: right;
}
</style>