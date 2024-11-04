<template>
<view>

</view>
</template>

<script>

export default {
  data() {
    return {
      code:'',
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	 this.code = options.code
	 uni.showLoading({
	 	title: '加载中'
	 });
	 
	 if(this.code){
		 this.login()
	 }
  },
  methods: {
   login(){
	   uni.request({
	   	url: getApp().globalData.ser_url + '/index.php?app=login&mod=instagram_notify&code='+this.code ,
	   	method: 'GET',
	   	header: {
	   		'Content-Type': 'application/x-www-form-urlencoded'
	   	},
	   	success: res => {
			uni.hideLoading()
	   		if(res.data.state==200){
				uni.setStorageSync('token',res.data.data.token)
				uni.showToast({
					title:'登录成功',
					icon:'none',
					duration:2000
				})
				setTimeout(()=>{
					location.href = getApp().globalData.h5_url + 'pages/user/user'
				},2000)
			}else {
				uni.showToast({
					title:res.data.msg,
					icon:'none',
					duration:2000
				})
			}
	   	}
	   });
   },

  }
};
</script>
<style>


</style>