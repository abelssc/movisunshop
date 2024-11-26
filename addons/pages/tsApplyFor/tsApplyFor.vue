<template>
<view>
<view class="tsBg">
  <image :src="img_url+$L('tsBg.png')" mode="widthFix"></image>
</view>

<view class="tip">
  <view class="title">{{$L('开通方式')}}</view>
  <view class="con">
    <text>{{$L('开通方式一:购买活动专区任意商品达到')}}{{TsCondition.ssys_ts_condition2_goodsmoney}}{{$L('元即可开通')}}</text>
    <text>{{$L('开通方式二:历史单个商城账号累计购买商品满')}}{{TsCondition.ssys_ts_condition1_money}}{{$L('元的用户,确认收货后可自动开通')}}</text>
  </view>
</view>

<view class="goodsList">
  <view v-for="(item, index) in goodsList" :key="index" class="goods-item" :data-gid="item.gid" @tap="confirmOrder">
    <view class="goods-img">
      <image :src="item.goods_image" mode="aspectFit"></image>
    </view>
    <view class="goods-name">{{item.goods_name}}</view>
    <view class="goods-price">{{$L('￥')}} <text>{{item.goods_price}}</text></view>
    <button class="buy" :data-gid="item.gid">{{$L('立刻购买')}}</button>
  </view>
</view>

<button class="sq" @tap="showPop">{{$L('申请成为推手')}}</button>

<view class="tsCondition" v-if="show">
  <view class="ts-main">
    <view class="ts-con">
      <view class="ts-item">
        <text>{{JudgeTsCondition.condition2_p}}</text>
        <text class="center">{{$L('目前')}}{{JudgeTsCondition.condition2}}</text>
      </view>
      <view class="ts-item">
        <text>{{JudgeTsCondition.condition1_p}}</text>
        <text class="center">{{$L('目前')}}{{JudgeTsCondition.condition1}}{{$L('元')}}</text>
      </view>
    </view>

    <view class="btn" @tap="close">{{$L('我知道了')}}</view>
  </view>
</view>

<sldMenu nowPage="ts"></sldMenu> 

<common :title="$L('申请成为推手')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      ssys_key: '',
      TsCondition: '',
      goodsList: [],
      member_info: '',
      JudgeTsCondition: {},
      show: false,
      img_url: getApp().globalData.img_url,
      showMenu: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('推手')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key
    });
    this.getTsCondition();
    this.getTsConditionGoods();
  },
  onReachBottom: function () {},
  methods: {
    getTsCondition() {
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=ts_condition&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.status == 200) {
            this.setData({
              TsCondition: res.data.data
            });
          }
        }
      });
    },

    getTsConditionGoods() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=ts_condition_goods&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key
        },
        success: res => {
          if (res.data.status == 200) {
            this.setData({
              goodsList: res.data.data,
              member_info: res.data.member_info
            });
          }
        }
      });
    },

    getJudgeTsCondition() {
      const {
        ssys_key
      } = this;
      return new Promise((resolve, reject) => {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=index&mod=judge_ts_condition&sld_addons=spreader',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            ssys_key: ssys_key
          },
          success: res => {
            if (res.data.status == 255) {
              this.setData({
                JudgeTsCondition: res.data.data
              });
              resolve();
            } else {
              reject();
            }
          },
          error: err => {
            reject();
          }
        });
      });
    },

    showPop() {
      this.getJudgeTsCondition().then(() => {
        this.setData({
          show: true
        });
      }).catch(() => {
        uni.reLaunch({
          url: '/addons/pages/tsIndex/tsIndex'
        });
      });
    },

    close() {
      this.setData({
        show: false
      });
    },

    // 立即购买
    confirmOrder(e) {
      let gid = e.currentTarget.dataset.gid;
      const {
        goodsList
      } = this;
      let item = goodsList.filter(el => el.gid == gid)[0];
      let url = `/pages/confirm_order/confirm_order?markgid=${gid}&buynum=1&gid=${gid}&from=apply`;
      uni.navigateTo({
        url: url
      });
    }

  }
};
</script>
<style>

page {
  background-color: #f6f6f6;
  width: 750rpx;
  margin: 0 auto;
}

.tsBg {
  width: 750rpx;
  margin: 0 auto;
}

.tsBg image {
  width: 100%;
}

.tip {
  width: 710rpx;
  height: 208rpx;
  box-sizing: border-box;
  background-color: #fff;
  margin: 13rpx 20rpx 20rpx;
  padding: 20rpx 20rpx 0;
  position: relative;
  left: 50%;
  transform: translateX(-375rpx);
  
}

.tip .title {
  position: relative;
  text-align: center;
  color: #333030;
  font-size: 28rpx;
}

.tip .title::after, .tip .title::before {
  position: absolute;
  content: "";
  top: 18rpx;
  width: 102rpx;
  height: 1rpx;
  background-color: #e9e4e5;
}

.tip .title::after {
  left: 158rpx;
}

.tip .title::before {
  right: 158rpx;
}

.tip .con {
  color: #6d6868;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-top: 20rpx;
}

.tip .con text {
  display: block;
}

.goodsList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20rpx;
}

.goodsList .goods-item {
  width: 345rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  padding-bottom: 24rpx;
}

.goods-item .goods-img {
  width: 345rpx;
  height: 345rpx;
}

.goods-item .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-item .goods-name {
  height: 72rpx;
  font-size: 24rpx;
  color: #6a6c78;
  line-height: 36rpx;
  margin: 20rpx 10rpx;
  font-family: "Urbanist", "sans-serif";
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.goods-item .goods-price {
  color: #e62c2e;
  font-size: 24rpx;
}

.goods-item .goods-price text {
  font-size: 30rpx;
  font-weight: 600;
}

.goods-item .buy {
  border-radius: 10rpx;
  background-color: #fc3357;
  color: #fff;
  height: 48rpx;
  font-size: 24rpx;
  line-height: 48rpx;
  margin-top: 20rpx;
}

.sq {
  height: 88rpx;
  line-height: 88rpx;
  margin: 20rpx 20rpx 50rpx;
  color: #fff;
  background-color: #fc3357;
  border-radius: 20rpx;
  font-size: 36rpx;
}

.tsCondition {
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tsCondition .ts-main {
  display: flex;
  flex-direction: column;
  width: 80vw;
  height: 400rpx;
  background-color: #fff;
}

.tsCondition .ts-main .ts-con {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 26rpx;
  padding: 0 30rpx;
  line-height: 36rpx;
}

.tsCondition .ts-con .ts-item:nth-child(1){
  margin-bottom: 30rpx;
}

.tsCondition .ts-con .ts-item text{
  display: block;
  text-align: center;
}

.tsCondition .ts-main .btn {
  width: 100%;
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  color: #40affe;
  font-size: 28rpx;
  border-top: 1px solid #d0d0d0;
}


.menu {
  position: fixed;
  bottom: 171rpx;
  right: 23rpx;
  z-index: 999;
}

.menu .menu_main {
  position: relative;
  width: 106rpx;
  height: 111rpx;
  z-index: 99;
}

.menu .menu_main image {
  max-width: 100%;
  max-height: 100%;
}

.menu .menu_child .child {
  position: absolute;
  top: 0;
  left: 0;
  width: 100rpx;
  height: 100rpx;
  opacity: 0;
  z-index: 98;
  transform: translate(0,0) scale(0);
  transition: all 0.3s;
}

.menu .menu_child .child image {
  max-width: 100%;
  max-height: 100%;
}

.menu .menu_child .m2{
  width: 94rpx;
  height: 102rpx;
}

.menu .menu_child .m3{
  width: 98rpx;
  height: 102rpx;
}

.menu.on .menu_child .m1{
  transform: translate(0,-120rpx) scale(1);
  opacity: 1;
}

.menu.on .menu_child .m2{
  transform: translate(-120rpx,-60rpx) scale(1);
  opacity: 1;
}

.menu.on .menu_child .m3{
  transform: translate(-120rpx,60rpx) scale(1);
  opacity: 1;
}
</style>