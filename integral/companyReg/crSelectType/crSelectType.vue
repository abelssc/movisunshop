<template>
<view>
<navigator class="bw sel-type" hover-class="none" :url="'/integral/companyReg/crSelectType2/crSelectType2?apply_t=0&reapply=' + reapply">
  <view class="flex-container sel-info">
    <image :src="img_url+'integral/crtype1.png'"></image>
    <view class="type-info">
      <view class="title">{{$L('个人入驻')}}</view>
      <view class="tip">{{$L('以个人名义创建个体商户')}}</view>
    </view>
  </view>
  
  <image class="more" src="/static/integral/images/crright.png"></image>
</navigator>

<navigator class="bw sel-type" hover-class="none" :url="'/integral/companyReg/crSelectType2/crSelectType2?apply_t=1&reapply=' + reapply">
  <view class="flex-container sel-info">
    <image :src="img_url+'integral/crtype.png'"></image>
    <view class="type-info">
      <view class="title">{{$L('企业入驻')}}</view>
      <view class="tip">{{$L('以企业名义创建企业商户')}}</view>
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
      reapply: 0,
      img_url: getApp().globalData.img_url //图片地址

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('入驻申请')
    });
    if (options.reapply) {
      this.setData({
        reapply: options.reapply
      });
    }
  },
  methods: {}
};
</script>
<style>
@import "../../common/crcommon.css";
</style>