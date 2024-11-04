<template>
<view>
<view class="pin-nav">
  <view :class="'nav-item ' + (tid==1?'on':'')" data-id="1" @tap="changeNav">
    <text>{{$L('我发起的拼团')}}</text>
  </view>
  <view :class="'nav-item ' + (tid==0?'on':'')" data-id="0" @tap="changeNav">
    <text>{{$L('我参与的拼团')}}</text>
  </view>
</view>
<view class="list-wrap" v-if="pinList.length">
  <navigator v-for="(item, index) in pinList" :key="index" hover-class="none" :url="'/integral/activity/pin_detail/pin_detail?id=' + item.sld_team_id" class="item">
    <view class="img">
      <image class="goods-img" :src="item.sld_pic" mode="aspectFit"></image>

      <image class="state-img" :src="item.sld_tuan_status==0?img_url+'team_status_0.png':(item.sld_tuan_status==1?img_url+'team_status_1.png':img_url+'team_status_2.png')"></image>
    </view>

    <view class="goods-info">
      <view class="name">{{item.goods_name}}</view>
      <view class="pro">{{item.sld_team_count}}{{$L('人团')}} | {{$L('已拼')}}{{item.sales}}{{$L('件')}}</view>
      <view class="price">
        <view class="red">{{$L('￥')}} <text>{{item.sld_pin_price}}</text></view>
        <text class="s">{{$L('省')}}{{item.sheng}}{{$L('元')}}</text>
      </view>
    </view>
  </navigator>
</view>

<view class="empty" v-if="!pinList.length && !isLoading">
    <view class="img">
      <image :src="img_url+'search_w.png'" mode="widthFix"></image>
    </view>
    <view class="tip">{{$L('没有找到拼团活动')}}</view>
    <text>{{$L('还有很多优惠等着你呢！')}}</text>
    <navigator url="/integral/activity/pin_index/pin_index" hover-class="none" class="btn">{{$L('去看看')}}</navigator>
</view>

<common :title="$L('拼团')"></common>
</view>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      key: '',
      pinList: [],
      isLoading: true,
	  img_url: getApp().globalData.img_url,
      tid: 0,
	  pn:1
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('拼团列表')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.initData();
  },
  methods: {
    initData() {
      this.getList();
    },

    getList() {
      let {
        tid,
        key
      } = this;
      request({
        url: getApp().globalData.ser_url + `/index.php?app=team&mod=data&sld_addons=pin&tid=${tid}&pn=${this.pn}`,
        method: 'post',
        data: {
          key: key
        },
        loading: this.pn == 1
      }).then(res => {
        if (res.code == 200) {
          let list = res.datas.goods;

          if (this.pn == 1) {
            this.setData({
              pinList: list
            });
          } else {
            let {
              pinList
            } = this;
            this.setData({
              pinList: pinList.concat(list)
            });
          }
        }

        if (this.pn == 1) {
          this.setData({
            isLoading: false
          });
        }
      }).catch(err => {
        if (this.pn == 1) {
          this.setData({
            isLoading: false
          });
        }
      });
    },

    changeNav(e) {
      let id = e.currentTarget.dataset.id;
      let {
        tid
      } = this;
      if (tid == id) return;
      this.setData({
        tid: id
      });
      this.pn = 1;
      this.hasmore = true;
      this.getList();
    }

  }
};
</script>
<style>
/* integral/activity/pin_list/pin_list.wxss */

page {
  background-color: #f5f5f5;
  width: 750rpx;
  margin: 0 auto;
}

.pin-nav {
  display: flex;
  width: 750rpx;
  height: 90rpx;
  background-color: #fff;
}

.pin-nav .nav-item {
  flex: 1;
  text-align: center;
  color: #222;
  font-size: 34rpx;
}

.pin-nav .nav-item text {
  display: inline-block;
  line-height: 89rpx;
  border-bottom: 1rpx solid transparent;
}

.pin-nav .nav-item.on {
  color: #d91e17;
}

.pin-nav .nav-item.on text {
  border-color: #d91e17;
}

.list-wrap {
  margin: 20rpx 0;
}

.list-wrap .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 212rpx;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.item .img {
  flex: 0 212rpx;
  position: relative;
  width: 212rpx;
  height: 212rpx;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.item .img .goods-img {
  width: 212rpx;
  height: 212rpx;
}

.item .img .state-img {
  position: absolute;
  bottom: 0rpx;
  right: 0rpx;
  width: 110rpx;
  height: 110rpx;
}

.item .goods-info {
  flex: 1;
  width: 100%;
  padding-left: 30rpx;
}

.item .goods-info .name {
  height: 84rpx;
  font-size: 28rpx;
  color: #222;
  line-height: 42rpx;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.item .goods-info .pro {
  color: #999;
  font-size: 24rpx;
  margin: 20rpx 0;
}

.item .goods-info .price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
}

.goods-info .price .red {
  color: #ef1b21;
}

.goods-info .red text {
  font-size: 40rpx;
}

.goods-info .s {
  color: #999;
}


.empty{
  display: flex;
  width: 750rpx;
  height: calc(100vh - 100rpx);
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty .img{
  width: 140rpx;
  height: 140rpx;
  background-color: #DDD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty .img image{
  width: 100rpx;
  height: 100rpx;
}

.empty .tip{
  color: #000;
  font-size: 30rpx;
  margin: 30rpx 0;
}

.empty text{
  font-size: 26rpx;
  color: #999;
}

.empty .btn{
  height: 60rpx;
  padding: 0 30rpx;
  color: #555;
  font-size: 26rpx;
  border-radius: 10rpx;
  line-height: 58rpx;
  margin-top: 20rpx;
  border: 1rpx solid #e3e5e9;
}
</style>