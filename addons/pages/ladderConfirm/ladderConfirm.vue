<template>
<view>
<block v-if="address_id">
  <navigator :url="'/pages/address/address?form=1&address_id=' + address_id + '&isback=1'" hover-class="none" class="has_addr">
    <view class="address_left">
      <view>
        <text>{{address_info.true_name}}</text>
        <text>{{address_info.mob_phone}}</text>
      </view>
      <text>{{address_info.area_info+' '+address_info.address}}</text>
    </view>
    <view class="address_right">
      {{$L('更换')}}
      <image src="/static/addons/images/ltr.png"></image>
    </view>
  </navigator>
</block>
<block v-else>
  <navigator url="/pages/addaddress/addaddress?form=1" hover-class="none" class="no_addr">
    <view class="add_addr">
      + {{$L('添加收货地址')}}
    </view>
  </navigator>
</block>
<image :src="img_url+'addons/addr.png'" mode="widthFix" class="line marginB20"></image>

<view class="goods marginB20">
  <view class="title">{{$L('商品列表')}}</view>
  <navigator hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + gid" class="goods_item">
    <view class="goods_logo">
      <image :src="goods_info.goods_image" mode="widthFix"></image>
    </view>
    <view class="goods_info">
      <text class="name">{{goods_info.goods_name}}</text>
      <text class="price">{{$L('定金')}}<text>{{$L('￥')}}{{goods_info.sld_deposit_money}}x{{goods_info.goods_num}}</text></text>
      <view class="bw">
        <text>{{$L('单买价：')}} {{$L('￥')}}{{goods_info.goods_price}}</text>
      </view>
    </view>
  </navigator>
</view>

<view class="money marginB20">
  <view class="title">{{$L('费用详情')}}</view>
  <view class="m_item">
    <text class="m_left">{{$L('阶段一')}}</text>
    <text class="m_right">{{$L('定金')}}<text>{{$L('￥')}}{{goods_info.sld_deposit_money*goods_info.goods_num}}</text></text>
  </view>
</view>

<view class="msg marginB20">
  <view class="title">{{$L('买家留言')}}</view>
  <view class="msg_input">
    <textarea :placeholder="$L('请输入留言')" :value="member_message" @input="textInput"></textarea>
  </view>
</view>

<view class="agreement marginB20" v-if="goods_info.is_tui==0">
  {{$L('我已同意定金不退的条件')}}
  <radio color="#ED6307" :checked="agreement" @tap="radioHandle"></radio>
</view>

<view class="footer">
  <view class="foot_left" v-if="goods_info.sld_deposit_money*goods_info.goods_num">{{$L('应付定金：')}}{{$L('￥')}}{{goods_info.sld_deposit_money*goods_info.goods_num}}</view>
  <view class="foot_btn" @tap="submit">{{$L('去支付')}}</view>
</view>
<common :title="$L('支付定金')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      key: '',
      pin_id: '',
      num: '',
      gid: '',
      agreement: false,
      // 是否同意协议
      member_message: '',
      address_info: "",
      address_id: "",
      goods_info: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('支付定金')
    });
    const {
      gid,
      num,
      id
    } = options;
    const key = uni.getStorageSync('token');
    this.setData({
      gid,
      num,
      pin_id: id,
      key
    });
    this.getConfirmData();
  },

  onShow() {
    if (Array.isArray(this.address_info)) {
      this.getConfirmData();
    }
  },

  methods: {
    // 获取页面初始数据
    getConfirmData() {
      const {
        key,
        pin_id,
        num,
        gid
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=buy_ladder&mod=iwantpinladder&sld_addons=pin_ladder',
        data: {
          key,
          pin_id,
          number: num,
          gid
        },
        success: res => {
          if (res.data.status == 200) {
            let data = res.data.data;
            let address_id = '';

            if (Object.prototype.toString.call(data.address) == '[object Object]') {
              address_id = data.address.address_id;
            }

            this.setData({
              address_info: data.address,
              address_id: address_id,
              goods_info: data.goods_info
            });
          } else if (res.data.status == 255) {
            uni.showModal({
              title: this.$L('提示'),
              showCancel: false,
              content: res.data.msg,
              confirmText:this.$L('确定'),
              success: function () {
                uni.navigateBack({});
              }
            });
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none'
            });
          }
        }
      });
    },

    textInput(e) {
      this.setData({
        member_message: e.detail.value
      });
    },

    radioHandle() {
      let {
        agreement
      } = this;
      this.setData({
        agreement: !agreement
      });
    },

    addr(e) {
      this.setData({
        address_info: e,
        address_id: e.address_id
      });
    },

    submit() {
      let {
        gid,
        num,
        pin_id,
        key,
        agreement,
        address_id,
        member_message,
        goods_info
      } = this;

      if (!address_id) {
        uni.showToast({
          title: this.$L('请选择收货地址'),
          icon: 'none'
        });
        return;
      }

      if (!agreement && goods_info.is_tui == 0) {
        uni.showToast({
          title: this.$L('请同意协议'),
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=buy_ladder&mod=submitorder&sld_addons=pin_ladder',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          gid,
          number: num,
          pin_id,
          key,
          address_id,
          member_message
        },
        success: res => {
          if (res.data.status == 200) {
            const order_sn = res.data.data.order_sn;
            const p = goods_info.sld_deposit_money;
            uni.redirectTo({
              url: `/addons/pages/pay/pay?order_sn=${order_sn}&p=${p}&type=ladder`
            });
          } else {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        }
      });
    }

  }
};
</script>
<style>
page {
  font-size: 28rpx;
  color: #353535;
  background-color: #F6F6F6;
  width: 750rpx;
  margin: 0 auto;
}

.has_addr, .no_addr {
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 177rpx;
  background-color: #fff;
}

.has_addr {
  justify-content: space-between;
  padding: 0 10rpx;
  box-sizing: border-box;
}

.no_addr {
  justify-content: center;
}

.has_addr .address_left view:nth-child(1){
  margin-bottom: 30rpx;
}

.address_left view:nth-child(1) text{
  margin-right: 30rpx;
}

.has_addr .address_right{
  display: flex;
  align-items: center;
  color: #A5A5A5;
  font-size: 24rpx;
}

.has_addr .address_right image{
  width: 10rpx;
  height: 0;
  margin-left: 15rpx;
}

.no_addr .add_addr{
  height: 60rpx;
  padding: 0 30rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
  border: 1rpx solid #999;
}

.line{
  width: 750rpx;
  height: 5rpx;
}

.marginB20{
  margin-bottom: 20rpx;
}

.goods{
  background-color: #fff;
}

.title{
  line-height: 70rpx;
  padding-left: 20rpx;
  font-size: 32rpx;
  border-bottom: 1rpx solid #E8E8E8;
}

.goods_item{
  display: flex;
  align-items: center;
  height: 280rpx;
  padding: 0 20rpx;
}

.goods_item .goods_logo{
  flex: 0 0 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220rpx;
  height: 220rpx;
  border: 1rpx solid #F0F0F0;
  overflow: hidden;
}

.goods_item .goods_logo image{
  max-width: 220rpx;
  height: 0;
}

.goods_item .goods_info{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220rpx;
  flex: 1;
  margin-left: 20rpx;
}

.goods_info .name{
  line-height: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.goods_info .price{
  color: #363636;
  font-size: 30rpx;
}

.goods_info .price text{
  font-size: 32rpx;
  color: #F31010;
}

.goods_info .bw{
  display: flex;
  align-items: center;
  color: #666666;
  font-size: 28rpx;
}

.goods_info .bw text:nth-child(2){
  color: #999;
  font-size: 24rpx;
  margin-left: 20rpx;
}

.money{
  background-color: #fff;
}

.money .m_item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
}

.m_item .m_right text{
  color: #FE011D;
  margin-left: 20rpx;
}

.msg{
  background-color: #fff;
}

.msg_input{
  height: 120rpx;
  padding: 20rpx 20rpx;
}

.msg_input textarea{
  width: 100%;
  height: 120rpx;
  background-color: #F6F6F6;
  padding: 10rpx;
  box-sizing: border-box;
}

.agreement{
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  background-color: #fff;
}

.agreement radio{
  margin-left: 20rpx;
}

.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  height: 98rpx;
  width: 750rpx;
  margin: 0 auto;
}

.footer .foot_btn{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 252rpx;
  height: 98rpx;
  color: #fff;
  font-size: 30rpx;
  background-color: #ED6307;
}

.footer .foot_left{
  flex: 1;
  text-align: center;
  color: #F01313;
  font-size: 30rpx;
  font-weight: 600;
}

</style>