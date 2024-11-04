<template>
<view>
<navigator class="bw sel-type" hover-class="none" :url="'/integral/companyReg/crStep1/crStep1?apply_t=' + apply_t + '&is_supplier=0&reapply=' + reapply">
  <view class="flex-container sel-info">
    <image :src="img_url+'integral/crtype1.png'"></image>
    <view class="type-info">
      <view class="title">{{$L('入驻零售商')}}</view>
      <view class="tip">{{$L('售卖的商品将展示在商城供消费者购买')}}</view>
    </view>
  </view>
  
  <image class="more" src="/static/integral/images/crright.png"></image>
</navigator>

<navigator class="bw sel-type" hover-class="none" :url="'/integral/companyReg/crStep1/crStep1?apply_t=' + apply_t + '&is_supplier=1&reapply=' + reapply" v-if="showPf">
  <view class="flex-container sel-info">
    <image :src="img_url+'integral/crtype.png'"></image>
    <view class="type-info">
      <view class="title">{{$L('入驻批发商')}}</view>
      <view class="tip">{{$L('售卖的商品将展示在批发市场供店铺、消费者购买')}}</view>
    </view>
  </view>
  
  <image class="more" src="/static/integral/images/crright.png"></image>
</navigator>

<common :title="$L('选择入驻方式')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      apply_t: '',
      reapply: 0,
      key: '',
      showPf: false,
      img_url: getApp().globalData.img_url //图片地址

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('入驻申请')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.setData({
      apply_t: options.apply_t
    });

    if (options.reapply) {
      this.setData({
        reapply: options.reapply
      });
    }

    this.initData();
  },
  methods: {
    initData() {
      const {
        key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=checkAllowShowSupplier&key=' + key + '&reapply=0',
        success: res => {
          if (res.data.datas.allow_show_supplier) {
            this.setData({
              showPf: true
            });
          }
        }
      });
    }

  }
};
</script>
<style>
@import "../../common/crcommon.css";
</style>