<template>
<view class="container_pri">
	<!-- #ifdef APP-PLUS  -->
<rich-text :nodes="html"></rich-text>
<!-- #endif -->

	<!-- #ifndef APP-PLUS  -->
<rich-text :nodes="h5_wx_html"></rich-text>
<!-- #endif -->
</view>
</template>

<script>
import privacyPolicy from "../../utils/privacyPolicy.js";

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
	  hasmore: true,
	  html:'',
	  h5_wx_html:''
    };
  },

  components: {},
  props: {},
  onShow: function () {
   this.html=privacyPolicy.user_privacy_policy_content
  },
  onLoad(){
    uni.setNavigationBarTitle({
        title: this.$L('隐私政策')
    });
	  this.getPrivacyPolicy()
  },
  methods:{
	  getPrivacyPolicy(){
		  uni.request({
		  	url: getApp().globalData.ser_url + '/index.php?app=index&mod=getAppResources',
		  	success: result => {
				this.h5_wx_html=result.data.data.user_privacy_policy_content
		  	}
		  });
	  }
  }

};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
.container_pri{
	width: 90%;
	height: 100vh;
	margin: 0 auto;
}
p{
	margin-top: 20px;
}
</style>