<template>
<view>

<view class="con" v-if="article_detail">
  <view v-html="article_detail"></view>
</view>

<view class="empty" v-if="!article_detail && isLoading">
  <view class="img">
    <image :src="img_url+'order_w.png'"></image>
  </view>
  <text>{{$L('暂无数据')}}</text>
</view>

<tsCommon></tsCommon>
<common :title="$L('活动规则')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      article_detail: '',
      isLoading: false,
      article: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('活动规则')
    });
    this.getRule();
  },
  methods: {
    getRule() {
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=rule_page&sld_addons=spreader',
        success: res => {
          if (res.data.datas.status == 1) {
            let data = res.data.datas.rule_content;

            if (data) {
              this.setData({
                article_detail: data
              });
            }
          }
        },
        complete: () => {
          this.setData({
            isLoading: true
          });
        }
      });
    }

  }
};
</script>
<style>

.con{
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
}


.empty{
  height: 750rpx;
  width: 750rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.empty .img{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #ddd;
}

.empty text{
  color: #666;
  font-size: 28rpx;
  margin-top: 30rpx;
}

.empty .img image{
  width: 100rpx;
  height: 100rpx;
}
</style>