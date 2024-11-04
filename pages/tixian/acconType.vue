<template>
<view>
<!--<import src="../templates/not.wxml"></import>-->

<view class="type">
  <block v-if="CashTypeList.length">
    <view v-for="(item, index) in CashTypeList" :key="index" class="list" :data-id="item.id" @tap="go">
      <view class="img">
        <image :src="img_url+item.url" mode="widthFix"></image>
      </view>
      <text>{{item.type_name}}</text>
    </view>
  </block>
  <block v-else>
    <block data-type="template" data-is="not" data-attr="img,content">
  <view class="nothasData" v-if="is_show_empty">
    <view class="img">
      <image :src="img"></image>
    </view>
    <text>{{content}}</text>
  </view>
</block>
  </block>
</view>
<common :title="$L('提现方式')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      CashTypeList: [],
      img: getApp().globalData.img_url + "order_w.png",
      content: this.$L('平台没有开启提现方式，请稍后提现'),
	  img_url:getApp().globalData.img_url,
	  is_show_empty:false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('提现方式')
    });
    this.getCashTypeList();
  },
  methods: {
    go(e) {
      let id = e.currentTarget.dataset.id;

      if (id) {
        uni.navigateTo({
          url: '/pages/tixian/accon?id=' + id
        });
      }
    },

    // 获取充值方式
    getCashTypeList() {
      let that = this,
          key = uni.getStorageSync('token');
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=cash&mod=getCashTypeList&key=' + key,
        method: 'GET',

        success(res) {
          if (res.data.state == 200) {
            let dat = res.data.data;
            dat.map(el => {
              if (el.type_name == that.$L('支付宝')) {
                el.url = 'zifubao@2x.png';
              }

              if (el.type_name == that.$L('银行卡')) {
                el.url = 'yinghangka@2x.png';
              }

              if (el.type_name == that.$L('微信')) {
                el.url = 'Group4@2x.png';
              }
            });
            that.setData({
              CashTypeList: dat,
			  is_show_empty:false
            });
          }else{
			  that.setData({
				  is_show_empty:true
			  })
		  }
        },

        error: function (err) {}
      });
    }

  }
};
</script>
<style>
/* pages/tixian/acconType.wxss */
page{
		width: 750rpx;
		margin: 0 auto;
	}
.type {
  width: 750rpx;
  height: calc(100vh - 30rpx);
  padding-top: 30rpx;
  background-color: #f5f5f5;
}

.list {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 30rpx;
  color: #555;
  border-bottom: 1rpx solid #eee;
  background-color: #fff;
  padding-left: 30rpx;
}

.list .img {
  display: inline-block;
  width: 50rpx;
  margin-right: 30rpx;
  transform: translateY(15rpx);
}

.list image{
  width: 100%;
  height: 0;
}
</style>