<template>
<view>
<view class="filter-item">
  <view class="filter-title">
    <text>{{$L('价格区间')}}</text>
  </view>

  <view class="price-wrap">
    <input type="number" :value="price_from" data-type="price_from" @input="inputHandle" :placeholder="$L('最低价')"></input>
    <text class="line"></text>
    <input type="number" :value="price_to" data-type="price_to" @input="inputHandle" :placeholder="$L('最高价')"></input>
  </view>
</view>

<view class="filter-item">
  <view class="filter-title">
    <text>{{$L('发货地')}}</text>
    <text class="tip">{{$L('（以实际发货地为准）')}}</text>
  </view>

  <view class="area-wrap">
    <picker mode="selector" :range="area_list" range-key="area_name" @change="selectArea">
      <view class="area">{{area?area:$L('请选择发货地')}}</view>
    </picker>
  </view>
</view>

<view class="filter-item">
  <view class="filter-title">
    <text>{{$L('店铺类型')}}</text>
  </view>

  <view class="store-wrap">
    <view :class="'store-type ' + (own_shop==1?'sel':'')" @tap="selShopType">{{$L('自营店铺')}}</view>
  </view>
</view>

<view class="footer">
  <view class="btn reset" @tap="reset">{{$L('重置')}}</view>
  <view class="btn confirm" @tap="confirm">{{$L('确认')}}</view>
</view>

<common :title="$L('筛选')"></common>
</view>
</template>

<script>
// pages/filter/filter.js
import request from "../../utils/request";
const app = getApp();

export default {
  data() {
    return {
      price_from: '',
      price_to: '',
      area_id: '',
      area: '',
      own_shop: '',
      area_list: [],
      type: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('筛选')
    });
    this.setData({ ...options
    });
    this.initData();
  },
  methods: {
    initData() {
      this.getArea();
    },

    getArea() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=search_adv'
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            area_list: res.datas.area_list
          });
        }
      });
    },

    inputHandle(e) {
      let type = e.currentTarget.dataset.type;
      let val = e.detail.value;
      this.setData({
        [type]: val
      });
    },

    selShopType() {
      let {
        own_shop
      } = this;
      this.setData({
        own_shop: own_shop ? 0 : 1
      });
    },

    selectArea(e) {
      let val = e.detail.value;
      let {
        area_list
      } = this;
      let item = area_list[val];
      this.setData({
        area_id: item.area_id,
        area: item.area_name
      });
    },

    reset() {
      this.setData({
        price_from: '',
        price_to: '',
        area_id: '',
        area: '',
        own_shop: ''
      });
    },

    confirm() {
      let {
        price_from,
        price_to,
        area_id,
        area,
        own_shop
      } = this;
      let page = getCurrentPages();
      let len = page.length;
      page[len - 2].$vm.filterData({
        price_from,
        price_to,
        area_id,
        area,
        own_shop
      });
      uni.navigateBack({});
    }

  }
};
</script>
<style>
/* pages/filter/filter.wxss */
page{
  background-color: #F8F8F8;
  width: 750rpx;
  margin: 0 auto;
}

.filter-item{
  margin-top: 20rpx;
  padding: 0 30rpx 20rpx;
  background-color: #fff;
  color: #2D2D2D;
  font-size: 24rpx;
}

.filter-item .filter-title{
  display: flex;
  align-items: center;
  height: 88rpx;
  font-size: 28rpx;
}

.filter-item .filter-title .tip{
  color: #949494;
  font-size: 24rpx;
  margin-left: 10rpx;
}

.price-wrap{
  display: flex;
  align-items: center;
}

.price-wrap input{
  width: 219rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background-color: #F5F5F5;
  font-size: 24rpx;
  text-align: center;
  line-height: 50rpx;
}

.price-wrap .line{
  width: 25rpx;
  height: 3rpx;
  margin: 0 39rpx;
  background-color: #2D2D2D;
}

.store-wrap .store-type,.area-wrap .area{
  display: inline-block;
  height: 50rpx;
  min-width: 200rpx;
  border-radius: 25rpx;
  background-color: #F5F5F5;
  font-size: 24rpx;
  padding: 0 20rpx;
  text-align: center;
  line-height: 50rpx;
}

.store-wrap .store-type.sel{
  background-color: #FC1C1C;
  color: #fff;
}

.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  height: 99rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 0 6rpx 0 #f5f5f5;
  margin: 0 auto;
}

.footer .btn{
  width: 150rpx;
  height: 50rpx;
  font-size: 26rpx;
  border-radius: 25rpx;
  overflow: hidden;
  text-align: center;
  line-height: 50rpx;
  margin-right: 30rpx;
  box-sizing: border-box;
}

.footer .btn.reset{
  border: 1rpx solid #FC1C1C;
  color: #FC1C1C;
  background-color: #fff;
}

.footer .btn.confirm{
  border: 1rpx solid #FC1C1C;
  color: #fff;
  background-color: #FC1C1C;
}
</style>