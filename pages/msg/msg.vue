<template>
<view>
<view class="msg">

  <view v-for="(item, index) in msgList" :key="index" class="msg_list" :data-type="item.type" @tap="getDetail">
    <view class="img">
      <image :src="item.imgSrc"></image>
      <text class="badge" v-if="newNum[item.type]*1>0">{{newNum[item.type]}}</text>
    </view>
    <text>{{item.name}}</text>
    <view class="arrow_right">
      <image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
    </view>
  </view>
  
</view>
<common :title="$L('消息中心')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      newNum: {},
      msgList: [{
        name: this.$L('发货提醒'),
        imgSrc: getApp().globalData.img_url + 'fahuo.png',
        type: 'fahuo'
      }, {
        name: this.$L('付款成功'),
        imgSrc: getApp().globalData.img_url + 'fukuan.png',
        type: 'fukuan'
      }, {
        name: this.$L('余额变动'),
        imgSrc: getApp().globalData.img_url + 'yue.png',
        type: 'yue'
      }, {
        name: this.$L('退款退货'),
        imgSrc: getApp().globalData.img_url + 'tuikuan.png',
        type: 'tui'
      }, {
        name: this.$L('预约提醒'),
        imgSrc: getApp().globalData.img_url + 'prepare.png',
        type: 'prepare'
      }, {
        name: this.$L('系统消息'),
        imgSrc: getApp().globalData.img_url + 'siteMsg.png',
        type: 'sys'
      }]
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('消息中心')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }
  },

  onShow() {
    this.getEverySystemNewNum();
  },

  methods: {
    getEverySystemNewNum() {
      const {
        key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getEverySystemNewNum',
        data: {
          key
        },
        success: res => {
          if (res.data.state == 'ok') {
            let data = res.data.data;
            this.setData({
              newNum: data
            });
          }
        }
      });
    },

    getDetail(e) {
      let type = e.currentTarget.dataset.type;
      uni.navigateTo({
        url: '/pages/msg/msg_detail?type=' + type
      });
    }

  }
};
</script>
<style>
/* pages/msg/msg.wxss */
page{
		width: 750rpx;
		margin: 0 auto;
	}
.msg {
  width: 750rpx;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
}

.msg .msg_list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20rpx;
  line-height: 80rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  overflow: hidden;
}

.msg_list .img {
  position: relative;
  flex: 0 0 80rpx;
  width: 80rpx;
  height: 80rpx
}

.msg_list .img image {
  width: 100%;
  height: 80rpx;
}

.msg_list>text {
  display: block;
  padding-left: 30rpx;
  color: #252525;
  flex: 1;
  font-size: 30rpx;
}

.msg_list .arrow_right {
  flex: 0 0 30rpx;
  width: 30rpx;
}

.msg_list .arrow_right image {
  width: 100%;
  height: 0;
  opacity: 0.7;
}

.badge{
  position: absolute;
  top: -5rpx;
  left: 55rpx;
  min-width: 30rpx;
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 15rpx;
  background-color: #FF1515;
  font-size: 20rpx;
  color: #fff;
  box-sizing: border-box;
  text-align: center;
  line-height: 30rpx;
}
</style>