<template>
	<view>
		<view class="bg">
			<image :src="img_url+'bindBg.png'"></image>
		</view>
		<view class="form">
			<view class="form_item">
				<label for="phone">
					<text>{{$L('用户名/手机号')}}</text>
				</label>
				<input type="text" :value="user" id="phone" data-name="user" @input="userHandle" :placeholder="$L('请输入用户名/手机号')"></input>
			</view>

			<view class="form_item">
				<label for="password">
					<text>{{$L('密码')}}</text>
				</label>
				<input :type="pwType" :value="password" id="password" data-name="password" @input="userHandle" :placeholder="$L('请输入密码')"></input>
				<view class="change pw" @tap="changePwType">
					<image mode="widthFix" :src="showPw ? img_url+'login_pass_show.png' : img_url+'login_pass_hide.png'"></image>
				</view>
			</view>

			<button class="submit" @tap="submit">{{$L('确 定')}}</button>
		</view>
		<!-- 授权成功后弹层 -->

		<view :class="'sld-success-wrap-new ' + (showBindTip?'on':'')" v-if="!key">
			<view class="sld-success">
				<view class="sld-success-title">{{$L('是否绑定已有账号')}}</view>
				<view class="sld-success-content">{{$L('绑定已有账号可以同步历史订单，购物车等数据；不绑定后续数据无法同步')}}</view>
				<view class="sld-btns">
					<button open-type="getPhoneNumber" @tap="cancelBindHandle">{{$L('暂不')}}</button>
					<button class="confirm" @tap="confirmBindHandle">{{$L('去绑定')}}</button>
				</view>
			</view>
		</view>
		<common :title="$L('绑定已有账号')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPw: false,
				showBindTip: false,
				pwType: 'password',
				img_url: getApp().globalData.img_url,
				user: '',
				password: '',
				name: "",
				keys: '',
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('绑定已有账号')
      });
			this.setData({ ...options
			});
			// #ifdef H5
			if (this.$isWeiXinBrower()) {
				//微信浏览器特殊处理
				if (options.keys) {
					uni.setStorageSync('token', options.keys);
					this.showBindTip = true;
				}
			}
			// #endif
		},
		methods: {
			changePwType() {
				let {
					showPw,
					pwType
				} = this;
				this.setData({
					showPw: !showPw,
					pwType: showPw ? 'password' : 'text'
				});
			},

			userHandle(e) {
				let name = e.currentTarget.dataset.name;
				this.setData({
					[name]: e.detail.value
				});
			},

			//绑定已有账号提示确定事件
			confirmBindHandle() {
				this.showBindTip = false;
			},

			//暂不绑定账号
			cancelBindHandle() {
				let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
				let inviteid =uni.getStorageSync('share_u')
				let spreader = '';
				let time = 0;
				if (tsGoodsInfo) {
					for (let key in tsGoodsInfo) {
						if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
							spreader = tsGoodsInfo[key].shareId;
							time = tsGoodsInfo[key].ssys_expire_day_time * 1;
						}
					}
				}

				let params = {
					ukey: uni.getStorageSync('uuid'),
					keys: uni.getStorageSync('token'),
					client: 'wap',
					shareId: spreader,
					inviteid: inviteid?inviteid:'',
				};
				
				
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_auto_register',
					data: params,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						this.showBindTip = false;
						if (res.data.state == 200) {
							uni.setStorageSync('token', res.data.data.key);
							let fromurl = uni.getStorageSync('fromurl');
							if (fromurl) {
								uni.removeStorage({
									key: 'fromurl',
									success: function(res) {}
								});
								uni.navigateTo({
									url: fromurl
								});
							} else {
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/user/user'
									});
								}, 1500);
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},

			submit() {
				let {
					keys,
					user,
					password
				} = this;
        let that = this
				if (!user || !password) {
					uni.showToast({
						title: this.$L('请完善信息'),
						icon: 'none'
					});
					return;
				}

				let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
				let spreader = '';
				let time = 0;

				if (tsGoodsInfo) {
					for (let key in tsGoodsInfo) {
						if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
							spreader = tsGoodsInfo[key].shareId;
							time = tsGoodsInfo[key].ssys_expire_day_time * 1;
						}
					}
				}
				// 获取用户唯一标识UUID(规则：客户端类型+下划线+36位唯一字符串uuid)
				let uuid = wx.getStorageSync('uuid');
				if (!uuid) {
					let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app
					wx.setStorageSync('uuid', uuid)
				}
				uni.setStorageSync('spreader', spreader)
				let params = {
					keys: keys,
					client: 'wx_xcx',
					username: user,
					password: password,
					spreader: spreader,
					ukey: uuid
				};
				let share_u = uni.getStorageSync('share_u');

				if (share_u) {
					params.inviteid = share_u;
				}

				//#ifdef H5
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_bind_account',
					method: 'POST',
					data: {
						ukey: uni.getStorageSync('uuid'),
						keys: uni.getStorageSync('token'),
						client: 'wap',
						spreader: spreader,
						username: user,
						password: password,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						if (res.data.datas.status != 255) {
							uni.setStorageSync('token', res.data.datas.key);
							let fromurl = uni.getStorageSync('fromurl');
							
							if (fromurl) {
								uni.removeStorage({
									key: 'fromurl',
									success: function(res) {}
								});
								uni.navigateTo({
									url: fromurl
								});
							} else {
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/user/user'
									});
								}, 1500);
							}
						} else {
							uni.showToast({
								title: res.data.datas.error,
								icon: 'none'
							});
						}
					}
				});
				//#endif

				//#ifdef MP-WEIXIN
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_bind_account_xcx',
					data: params,
					success: res => {
						if (res.data.datas.status == 200) {
							uni.setStorageSync('token', res.data.datas.key);
							uni.showToast({
								title: that.$L('绑定成功'),
								icon: 'none'
							});
							let fromurl = uni.getStorageSync('fromurl');

							if (fromurl) {
								uni.removeStorage({
									key: 'fromurl',
									success: function(res) {}
								});
								uni.navigateTo({
									url: fromurl
								});
							} else {
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/user/user'
									});
								}, 1500);
							}
						} else {
							uni.showToast({
								title: res.data.datas.error,
								icon: 'none'
							});
						}
					}
				});
				//#endif
				//#ifdef APP-PLUS
				let otherLoginInfo = uni.getStorageSync('otherLoginInfo');
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=app_wechat_bind_account',
					method: 'POST',
					data: {
						username: user,
						password: password,
						client: uni.getSystemInfoSync().platform,
						unionid: otherLoginInfo.unionid,
						openid: otherLoginInfo.openid,
						avator: otherLoginInfo.avator,
						nickname: otherLoginInfo.nickname,
						registerId: otherLoginInfo.registerId,
						ukey: uuid
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						if (res.data.datas.state == 200) {
							uni.setStorageSync('token', res.data.datas.key);
							uni.showToast({
								title: that.$L('绑定成功'),
								icon: 'none'
							});
							let fromurl = uni.getStorageSync('fromurl');

							if (fromurl) {
								uni.removeStorage({
									key: 'fromurl',
									success: function(res) {}
								});
								uni.navigateTo({
									url: fromurl
								});
							} else {
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									});
								}, 2000);
							}
						} else {
							uni.showToast({
								title: res.data.datas.msg || res.data.datas.error.msg,
								icon: 'none'
							});
						}
					}
				});
				//#endif

			}

		}
	};
</script>
<style>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		z-index: -1;
	}

	.bg image {
		width: 750rpx;
		height: 100vh;
	}

	.form {
		padding: 120rpx 70rpx 0;
	}

	.form .form_item {
		position: relative;
		display: flex;
		align-items: center;
		height: 96rpx;
		color: #ccc;
		font-size: 28rpx;
	}

	.form .form_item::after {
		position: absolute;
		content: '';
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1rpx;
		background-color: #ddd;
		transform: scaleY(0.5);
	}

	.form .form_item label {
		display: flex;
		align-items: center;
		flex: 0 0 196rpx;
	}

	.form .form_item input {
		flex: 1;
		line-height: 80rpx;
		height: 80rpx;
		border: none;
		color: #333;
		padding-left: 0 0 0 20rpx;
	}

	.form .form_item .change {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15rpx;
	}

	.form .form_item .change image {
		width: 31rpx;
		height: 0;
	}

	.submit {
		display: block;
		height: 74rpx;
		width: 615rpx;
		margin: 100rpx auto 0;
		background-color: #ff2f43;
		color: #fff;
		font-size: 28rpx;
		border-radius: 37rpx;
		border: none;
	}


	.sld-success-wrap-new {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		opacity: 0;
		z-index: -1;
		transition: all 0.3s;
	}

	.sld-success-wrap-new.on {
		z-index: 999;
		opacity: 1;
	}

	.sld-success-wrap-new .sld-success {
		width: 750rpx;
		height: 440rpx;
		background-color: #fff;
		color: #666;
		font-size: 28rpx;
		text-align-last: center;
		transform: translateY(440rpx);
		transition: all 0.3s;
	}

	.sld-success-wrap-new.on .sld-success {
		transform: translateY(0);
	}

	.sld-success-wrap-new .sld-success .sld-success-title {
		line-height: 38rpx;
		font-size: 32rpx;
		color: #333;
		padding: 50rpx 30rpx;
	}

	.sld-success-wrap-new .sld-success .sld-success-content {
		line-height: 45rpx;
		margin-bottom: 30rpx;
		padding: 0 35rpx;
		color: #999;
		font-size: 26rpx;
	}

	.sld-success-wrap-new .sld-success .sld-btns {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 90rpx;
	}

	.sld-success-wrap-new .sld-btns button {
		width: 230rpx;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		outline: none;
		background-color: #fff;
		color: #999;
		border: 1px solid #bfbfbf;
		margin: 0;
	}

	.sld-success-wrap-new .sld-btns button.confirm {
		color: #fff;
		background-color: #ec3633;
		border: 1px solid #ec3633;
		margin-left: 72rpx;
	}

	.sld-success-wrap-new .sld-btns button::after {
		border: 0;
	}

	.sld-success-wrap {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}
</style>
