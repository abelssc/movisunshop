<template>
	<view>
		<view class="setting">
			<navigator url="/pages/changeMenPw/changeMenPw" hover-class="none" class="item" v-if="!showPw">
				<view class="item-lfet">
					<text>{{$L('修改密码')}}</text>
					<text>{{$L('建议您定期更改密码以保护账户安全')}}</text>
				</view>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</navigator>

			<navigator :url="'/pages/Perfectinfo/Perfectinfo?title=' + ((info.member_nickname && info.member_mobile) ? $L('修改个人信息') : $L('完善个人信息'))"
			 hover-class="none" class="item">
				<text>{{(info.member_nickname && info.member_mobile) ? $L('修改个人信息') : $L('完善个人信息')}}</text>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</navigator>

			<navigator url="/pages/setpw/setpw" hover-class="none" class="item" v-if="showPw">
				<text>{{$L('设置密码')}}</text>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</navigator>

			<navigator hover-class="none" url="/pages/user/profile" class="item">
				<text>{{$L('修改头像')}}</text>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</navigator>
      
			<navigator hover-class="none" url="/pages/setting/language" class="item">
				<text>{{$L('切换语言')}}</text>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</navigator>
			
			<view @tap="cancle()" class="item">
				<text>{{$L('注销账号')}}</text>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</view>
			<!-- #ifdef APP-PLUS -->
			<navigator hover-class="none" url="/pages/privacyPolicy/privacyPolicy" class="item">
				<text>{{$L('用户协议和隐私政策')}}</text>
				<image :src="img_url+'pltr.png'" mode="widthFix"></image>
			</navigator>
			<!-- #endif -->
			
			<view class="logout" @tap="logout" v-if="showexit">
				<text>{{$L('安全退出')}}</text>
			</view>
		</view> 
		<common :title="$L('设置')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				showPw: true,
				key: '',
				showexit: false,
				info: ""
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('设置')
      });
			let key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					showexit: true
				});
			}

			this.setData({
				key
			});
			this.testmemberbuy(key);
			this.getUserInfo();
		},
		methods: {
			//注销账号 
			cancle(){
				const { key } = this;
				uni.showModal({
				  title: this.$L('提示'),
				  content: this.$L('确认注销该账号吗？'),
          cancelText:this.$L('取消'),
          confirmText:this.$L('确定'),
				  success: function (result) {
					if (result.confirm) {
						uni.request({
							url: getApp().globalData.ser_url + '/index.php?app=login&mod=memberCancel',
							data: {
								key
							},
							success: res => {
								if(res.data.state == 255){
									uni.showToast({
									  title: res.data.msg,
									  icon: 'none'
									});
								}else{
									uni.clearStorageSync('uuid'); //清空零时uuid
									uni.removeStorage('token');
									uni.removeStorage('share_u');
									uni.navigateTo({
										url: '/pages/login/login'
									});
								}
							}
						});
					}
				  }
				});
			},
			testmemberbuy(key) {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=testmemberbuy',
					data: {
						key
					},
					success: res => {
						if (res.data.state == 200) {
							this.setData({
								showPw: false
							});
						} else {
							this.getUserInfo();
						}
					}
				});
			},

			getUserInfo() {
				const {
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=supplement_info',
					data: {
						key
					},
					success: res => {
						this.setData({
							info: res.data
						});
					}
				});
			},

			logout() {
				const username = uni.getStorageSync("member_name");
				let client = 'wx_xcx';
				let curLang = uni.getStorageSync('curLang')
				let curLangs = ''
				if(uni.getStorageSync('curLangs')){
					curLangs = uni.getStorageSync('curLangs')		
				}
				//#ifdef MP-WEIXIN
				client = 'wx_xcx';
				//#endif
				//#ifdef APP-PLUS
				client = uni.getSystemInfoSync().platform;
				//#endif
				//#ifdef H5
				client = this.$isWeiXinBrower()?'wechat':'wap';
				//#endif
				//#ifdef MP-ALIPAY
				client = 'alipay_xcx';
				//#endif
				const {
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=logout',
					data: {
						key,
						username,
						client
					},
					success: res => {
						if (res.data.code == 200) {
							uni.clearStorageSync('uuid'); //清空零时uuid
							uni.removeStorage('token');
							uni.removeStorage('share_u');
							uni.setStorageSync('curLang',curLang)
							if(curLangs){
								uni.setStorageSync('curLangs',curLangs)

							}
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			},
			

		}
	};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
		height: 100%;
	}
	/* pages/setting/setting.wxss */
	.setting {
		width: 750rpx;
		height: 100%;
		padding-top: 20rpx;
		box-sizing: border-box;
		background-color: #f3f3f3;
	}

	.setting .item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 100rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		padding: 15rpx 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.setting .item image {
		width: 20rpx;
		height: 0;
		opacity: 0.6;
	}

	.setting .item-lfet text {
		display: block;
	}

	.setting .item-lfet text:last-child {
		color: #888;
		font-size: 26rpx;
		margin-top: 10rpx;
		font-weight: 300;
	}

	.setting .logout {
		height: 100rpx;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
	}
</style>
