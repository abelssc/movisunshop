<template>
<view>
<view class="exp-header">
  <image class="bg" :src="type=='points'?img_url+'points_bg.png':img_url+'balance_bg.png'"></image>
  <view class="exp-total">
    <image class="bg2" :src="type=='points'?img_url+'points_bg2.png':img_url+'balance_bg2.png'"></image>
    <text>{{num}}</text>
  </view>
</view>

<view class="experience-list" v-if="list.length">
  <view v-for="(item, index) in list" :key="index" class="exp-item border-bottom-1px">
    <view class="exp-item-top">
      <text>{{item.pl_desc}}</text>
      <text :class="item.pl_points*1>0?'':'h'">{{item.pl_points*1>0?'+':''}}{{item.pl_points}}</text>
    </view>
    <view class="time">{{type=='banance'?item.pl_addtime:item.wap_time}}</view>
  </view>
</view>

<view v-if="!list.length && !isLoading" class="not">
  <view class="img">
    <image :src="img_url+'search_w.png'"></image>
  </view>
  <text>{{$L('暂无数据')}}</text>
</view>

<common :title="title" v-if="title"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      type: '',
      // banance: 余额   points: 积分
      key: '',
      img_url: getApp().globalData.img_url,
      isLoading: true,
      title: '',
      num: "",
      list: "",
	  pn: 1,//当前页
	  hasmore: true
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('我的余额')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    let type = options.type;
    uni.setNavigationBarTitle({
      title: type == 'banance' ? this.$L('我的余额') : this.$L('我的积分')
    });
    this.setData({
      type: type,
      title: type == 'banance' ? this.$L('我的余额') : this.$L('我的积分')
    });
    this.initData();
  },

  onReachBottom() {
    if (this.hasmore) {
      let {
        type
      } = this;
      this.getList(type);
    }
  },

  methods: {
    initData() {
      let {
        type
      } = this;
      this.getUserInfoNum(type);
      this.getList(type);
    },

    getUserInfoNum(type) {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getUserInfoNum&key=' + this.key + '&fields=point'
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            num: type == 'banance' ? res.datas.member_info.predepoit : res.datas.member_info.point
          });
        }
      });
    },

    getList(type) {
      let {
        key
      } = this;
      let url = type == 'banance' ? getApp().globalData.ser_url + '/index.php?app=usercenter&mod=useryue&key=' + key + '&pn=' + this.pn + '&page=10' : getApp().globalData.ser_url + '/index.php?app=usercenter&mod=gerUserPointsInfo&key=' + key + '&pn=' + this.pn + '&page=10';
      request({
        url,
        loading: this.pn == 1
      }).then(res => {
        if (res.code == 200) {
          let data = res.datas.points_list;
          if (this.pn == 1) {
            this.setData({
              list: data
            });
          } else {
            let {
              list
            } = this;
            this.setData({
              list: list.concat(data)
            });
          }
        }

        if (res.hasmore) {
          this.pn++;
        } else {
          this.hasmore = false;
        }
        this.setData({
          isLoading: false
        });
      }).catch(err => {
        this.setData({
          isLoading: false
        });
      });
    }

  }
};
</script>
<style>

page {
  background-color: #f5f5f5;
  color: #333;
  width: 750rpx;
  margin: 0 auto;
}

.rule {
  margin-top: 20rpx;
  background-color: #fff;
  color: #999;
  font-size: 24rpx;
  line-height: 36rpx;
}

.title {
  position: relative;
  height: 68rpx;
  padding: 0 65rpx;
  color: #333;
  font-size: 24rpx;
  line-height: 68rpx;
}

.title::before {
  position: absolute;
  content: '';
  left: 40rpx;
  top: 20rpx;
  width: 4rpx;
  height: 28rpx;
  background-color: #ff3b3b;
}

.rule .con {
  padding: 15rpx 40rpx;
}

.experience-list {
  background-color: #fff;
  padding-left: 39rpx;
}

.experience-list .exp-item {
  padding: 15rpx 30rpx 15rpx 0;
}

.exp-item .exp-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.exp-item .exp-item-top text:nth-child(1) {
  width: 80%;
  font-size: 28rpx;
  color: #2d2d2d;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
}

.exp-item .exp-item-top text:nth-child(2) {
  color: #ff3b3b;
  font-size: 32rpx;
  font-weight: bold;
}

.exp-item .exp-item-top text.h:nth-child(2){
  color: #949494;
}

.exp-item .desc {
  font-size: 28rpx;
  line-height: 30rpx;
  padding: 10rpx 0;
  color: #949494;
}

.exp-item .time {
  color: #949494;
  font-size: 24rpx;
}

.empty {
  width: 750rpx;
  height: calc(100vh - 330rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty image {
  width: 135rpx;
  height: 0;
}

.empty view {
  margin: 20rpx 0 64rpx;
  color: #999;
  font-size: 24rpx;
}

.empty navigator {
  width: 160rpx;
  height: 40rpx;
  border-radius: 20rpx;
  text-align: center;
  line-height: 40rpx;
  border: 1rpx solid #333;
  color: #333;
  font-size: 24rpx;
}

.exp-header {
  position: relative;
  height: 310rpx;
}

.exp-header .bg {
  position: absolute;
  top: -90rpx;
  left: 0;
  height: 400rpx;
  width: 100%;
  z-index: 0;
}

.exp-header .exp-total {
  position: relative;
  margin: 60rpx auto 0;
  text-align: center;
  line-height: 163rpx;
  color: #fff;
}

.exp-header .exp-total .bg2 {
  position: absolute;
  top: 0;
  left: 50%;
  width: 167rpx;
  height: 163rpx;
  z-index: 0;
  transform: translateX(-50%);
}

.exp-header .exp-total text{
  position: relative;
  z-index: 2;
}

.exp-total-tip {
  position: relative;
  text-align: center;
  color: #fff;
  font-size: 24rpx;
  margin-top: 6rpx;
}

.not {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;
}

.not .img {
  width: 140rpx;
  height: 140rpx;
  background-color: #ddd;
  border-radius: 50%;
  overflow: hidden;
}

.not .img image {
  width: 80rpx;
  height: 80rpx;
  margin-top: 31rpx;
  margin-left: 29rpx;
}

.not text {
  margin-top: 30rpx;
  font-size: 30rpx;
  color: #000;
}

</style>