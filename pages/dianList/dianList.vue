<template>
<view>
<common :title="$L('附近门店')"></common>

<view class="store-list">
  <view v-for="(item, index) in storeList" :key="index" class="store-item" :data-index="index" @tap="openMap">
    <view class="pic">
      <image :src="item.dian_pic" mode="aspectFit"></image>
    </view>

    <view class="store-info">
      <text class="store-name">{{item.dian_name}}</text>

      <view class="store-addr">
        <image :src="img_url+'sld_dingwei@2x.png'" mode="widthFix"></image>
        <text>{{item.dian_address}}</text>
      </view>

      <view class="distance">
        <text>{{item.juli}}{{item.danwei}}</text>
        <text class="line"></text>
        <text class="tel">{{item.dian_phone}}</text>
      </view>
    </view>

    <text class="iconfont sld_mfanhui-"></text>
  </view>
</view>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      key: '',
      lng: '',
      lat: '',
      storeList: []
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('附近门店')
    });
    this.initData();
  },

  onReachBottom() {
    if (this.hasmore) {
      this.getStoreList();
    }
  },

  methods: {
    initData() {
      // 获取token
      const key = uni.getStorageSync('token');
      this.setData({
        key: key
      }); // 定位

      this.getPosition();
    },

    getPosition() {
      uni.getLocation({
        success: res => {
          let lng = res.longitude;
          let lat = res.latitude;
          this.setData({
            lng: lng,
            lat: lat
          });
          this.getStoreList();
        }
      });
    },

    getStoreList() {
      let {
        key,
        lng,
        lat
      } = this;
      let params = {
        page: 10,
        pn: this.pn,
        isgaode: 0
      };

      if (key) {
        params.key = key;
      }

      if (lng) {
        params.lng = lng;
      }

      if (lat) {
        params.lat = lat;
      }

      request({
        url: getApp().globalData.ser_url + '/index.php?app=dian&mod=get_list',
        data: params
      }).then(res => {
        if (res.code == 200) {
          let list = res.datas.goods_list;

          if (this.pn != 1) {
            let {
              storeList
            } = this;
            list = storeList.concat(list);
          }

          this.setData({
            storeList: list
          });

          if (res.hasmore) {
            this.pn++;
          } else {
            this.hasmore = true;
          }
        }
      });
    },

    openMap(e) {
      let index = e.currentTarget.dataset.index;
      const {
        storeList
      } = this;
      const target = storeList[index];
      uni.openLocation({
        latitude: target.dian_lat * 1,
        longitude: target.dian_lng * 1,
        name: target.dian_name,
        address: target.dian_address
      });
    }

  }
};
</script>
<style>
/* pages/dianList/dianList.wxss */

page {
  background-color: #f8f8f8;
}

.store-list {
  min-height: 100vh;
}

.store-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
}

.store-item .pic {
  flex: 0 0 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
}

.store-item .pic image {
  width: 100%;
  height: 100%;
}

.store-item .store-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160rpx;
  padding: 0 15rpx;
}

.store-info .store-name {
  color: #000;
  font-size: 30rpx;
}

.store-info .store-addr {
  display: flex;
  align-items: center;
}

.store-info .store-addr image {
  width: 30rpx;
  height: 0;
  margin-right: 15rpx;
}

.store-addr text {
  width: 450rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
  font-size: 26rpx;
}

.distance {
  display: flex;
  align-items: center;
  color: #8ec2e3;
  font-size: 24rpx;
}

.distance .line {
  display: inline-block;
  margin: 0 30rpx;
  width: 1px;
  height: 30rpx;
  background-color: #999;
}

.distance .tel {
  width: 300rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.iconfont {
  font-size: 26rpx;
  color: #999;
}

</style>