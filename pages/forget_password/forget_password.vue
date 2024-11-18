<!-- 忘记密码页面 -->
<template>
	<view class="forget_container">
		<!-- <text class="back-btn iconfont iconziyuan2" @click="navBack"></text> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
			<view class="login-title">
				{{$L('找回密码')}}
			</view>
			<view class="input-content">
				<view class="input-item input-item1">
					<picker @change="changeCountryCode" :value="currentCodeIndex" :range="countryCodeArray" range-key="country_code">
						<view class="uni-input" style="width: 50px;text-align: center;">{{countryCodeArray[currentCodeIndex]?countryCodeArray[currentCodeIndex].country_code:'区号'}}</view>
					</picker>
					<input type="number" :value="mobile" :placeholder="$L('请输入手机号')" maxlength="11" data-key="mobile" @input="inputChange"
					 placeholder-class="input_placeholder" style="margin-left: 10px;" @focus="setFocus" step="1" />
					<text class="clear-account iconfont iconziyuan34" v-show="mobile&&curFocus=='mobile'" @click="clearContent('mobile')"></text>
				</view>
				<view class="input-item pwd_wrap">
					<input type="number" :value="smsCode" maxlength="6" :placeholder="$L('请输入短信验证码')" data-key="smsCode" @input="inputChange"
					 placeholder-class="input_placeholder" @confirm="toLogin" @focus="setFocus" />
					<view class="pwd-right">
						<text class="clear-pwd iconfont iconziyuan34" v-show="smsCode&&curFocus=='smsCode'" @click="clearContent('smsCode')"></text>
						<view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
							<text class="sms-code">{{countDownM?`${countDownM}s${this.$L('后重新获取')}`:$L('获取验证码')}}</text>
						</view>
					</view>

				</view>
				<view class="input-item pwd_wrap">
					<input type="text" :value="password" :placeholder="$L('请设置6～20位英文、数字或符号的密码')" maxlength="20" :password="!showPwd"
					 placeholder-class="input_placeholder" data-key="password" @input="inputChange" @confirm="toLogin" @focus="setFocus" />
					<view class="pwd-right">
						<text class="clear-pwd iconfont iconziyuan34" v-show="password&&curFocus=='password'" @click="clearContent('password')"></text>
						<text :class="pwdState" @click="changePwdState"></text>
					</view>

				</view>
			</view>
			<button class="confirm-btn" @click="toResetPwd">{{$L('找回密码')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				mobile: '',
				password: '',
				smsCode: '',
				logining: false,
				showPwd: false,
				countDownM: 0, //短信验证码倒计时
				timeOutId: '', //定时器的返回值
				curFocus: '', //当前光标所在的位置
				currentCodeIndex:151,
				countryCodeArray:[],
			}
		},
		onLoad() {
			this.getCode()
		},
		computed: {
			pwdState: function() {
				return {
					'pwd-tab': true,
					iconfont: true,
					iconziyuan81: this.showPwd,
					iconziyuan9: !this.showPwd,
					curFocus: '', //当前光标所在的位置
				}
			}
		},
		methods: {
			...mapMutations(['login', 'setUserCenterData']),
			//光标聚焦事件
			setFocus(e) {
				this.curFocus = e.currentTarget.dataset.key;
			},
			changeCountryCode(e) {
				this.currentCodeIndex = e.detail.value;
			},
			// 区号
			getCode(){
				let that = this
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=country_list',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						
						that.countryCodeArray = res.data.data
					}
				});
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			//获取短信验证码
			getSmsCode() {
				if (this.countDownM) {
					return;
				}
				var reg = /(1[3-9]\d{9}$)/;

				if (this.mobile == "") {
					uni.showToast({
						title: this.$L('请输入手机号码'),
						icon: 'none'
					});
					return false;
				} else if (!reg.test(this.mobile)) {
					uni.showToast({
						title: this.$L('手机号码格式不正确，重新输入！'),
						icon: 'none'
					});
				} else {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=login_mobile&mod=send_sms_mobile',
						method: 'POST',
						data: {
							'mobile': this.mobile,
							'type': '2',
							'picyanzheng': ''
						},

						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: res => {
							if (res.data.datas.state == 'failuer') {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: this.$L('已发送'),
									icon: 'none'
								});
								this.countDownM = 60;
								this.countDown();
							}
						}
					})
				}
			},
			//倒计时
			countDown() {
				this.countDownM--;
				if (this.countDownM == 0) {
					clearTimeout(this.timeOutId);
				} else {
					this.timeOutId = setTimeout(this.countDown, 1000);
				}
			},
			//重置密码接口
			toResetPwd() {
				const {
					mobile,
					password,
					smsCode,
					logining
				} = this;
				var reg = /(1[3-9]\d{9}$)/;
				if (this.mobile == ""||this.smsCode == ""||this.password == "") {
					return
				}
				if (!reg.test(this.mobile)) {
					uni.showToast({
						title: this.$L('手机号码格式不正确，请重新输入！'),
						icon: 'none'
					});
					return
				}
				//密码的验证 6～20位，英文、数字或符号
				if (password.length < 6) {
					this.$api.msg(this.$L('密码最少6位哦～'));
					return false;
				} else if (password.length > 20) {
					this.$api.msg(this.$L('密码最多20位哦～'));
					return false;
				} else if (!(/[^\u4e00-\u9fa5]/.test(password))) {
					this.$api.msg(this.$L('密码不可以有中文哦～'));
					return false;
				} else if (!(/^\S*$/.test(password))) {
					this.$api.msg(this.$L('密码中不可以有空格哦～'));
					return false;
				}
				this.logining = true;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login_mobile&mod=editpass',
					method: 'POST',
					data: {
						'password': password,
						'mobile': mobile,
						'code': smsCode,
						'type': '2',
						'country_code':this.countryCodeArray[this.currentCodeIndex].country_code
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {

						if (res.data.datas.state == 'success') {
							uni.showToast({
								title: this.$L('重置密码成功'),
								icon: 'none'
							});
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								});
							}, 1500);
						} else {
							uni.showToast({
								title: res.data.datas.msg,
								icon: 'none'
							});
						}
					}
				});
				// let param = {};
				// param.url = 'v1/front/member/resetPassword';
				// param.data = {};
				// param.data.mobile = mobile;
				// param.data.smsCode = smsCode;
				// param.data.pwd = password;
				// param.method = 'POST';
				// this.$request(param).then(res => {
				// 	this.$api.msg(res.msg);
				// 	if (res.state == 200) {
				// 		setTimeout(() => {
				// 			uni.navigateBack();
				// 		}, 2000)

				// 	}
				// 	this.logining = false;
				// }).catch((e) => {})
			},

			//清空输入的内容
			clearContent(type) {
				this[type] = '';
			},

			//是否显示密码切换事件
			changePwdState() {
				this.showPwd = !this.showPwd;
			},

			//跳转事件 type:跳转类型，1为redirectTo 2为navigateTo
			navTo(url, type) {
				if (type == 1) {
					uni.redirectTo({
						url
					})
				} else if (type == 2) {
					uni.navigateTo({
						url
					})
				}
			},

		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
		width: 750rpx;
		margin: 0 auto;
	}

	.forget_container {
		position: relative;
		width: 750rpx;
		height: 94vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		margin-left: 40rpx;
		margin-top: 40rpx;
		font-size: 32rpx;
		color: $main-font-color;
		display: inline-block;
	}

	.login-title {
		position: relative;
		margin: 64rpx;
		font-size: 40rpx;
		color: #333;
		font-weight: bold;
	}

	.input-content {
		padding: 0 65rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		height: 80rpx;
		margin-bottom: 50upx;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;

		input {
			color: #2D2D2D;
			font-size: 28rpx;
		}

		.input_placeholder {
			color: $main-third-color;
			font-size: 30rpx;
		}

		.clear-account {
			position: absolute;
			right: 6rpx;
			top: 28rpx;
			font-size: 26rpx;
			color: #ddd;
		}

		&:nth-child(2) {
			.pwd-right {
				position: absolute;
				right: 6rpx;
				top: 6rpx;
				display: flex;
				align-items: center;
                z-index: 10;
				.clear-pwd {
					font-size: 26rpx;
					color: #ddd;
				}

				.sms-code-view {
					background:#48537d;
					padding: 14rpx;
					border-radius: 6rpx;
					line-height: 0;
					margin-left: 20rpx;

					.sms-code {
						color: #fff;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
		}

		&:last-child {
			margin-bottom: 0;

			.pwd-right {
				position: absolute;
				right: 6rpx;
				top: 14rpx;

				.clear-pwd {
					font-size: 26rpx;
					color: #ddd;
				}

				.pwd-tab {
					font-size: 30rpx;
					color: #666;
					margin-left: 20rpx;
					margin-right: 28rpx;

					&.iconziyuan9 {
						font-size: 15rpx;
						transform: scale(0.1)
					}

					&.iconziyuan81 {
						font-size: 20rpx;
						transform: scale(0.1)
					}

				}

				.forget-pwd {
					color: #2D2D2D;
					font-size: 28rpx;
					line-height: 28rpx;
					font-weight: 400;
					border-left: 1px solid $border-color-split;
					padding-left: 28rpx;
				}
			}
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}


	.confirm-btn {
		width: 620rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 90rpx;
		border-radius: 44rpx;
		color: #fff;
		font-size: 36rpx;
		background-color: #1E2A74;
	}

	.other-login {
		position: absolute;
		left: 0;
		bottom: 140rpx;
		width: 100%;
		display: flex;
		flex-direction: column;

		.title {
			display: flex;
			justify-content: center;
			align-items: center;

			&:before {
				content: ' ';
				width: 150rpx;
				height: 1rpx;
				background: #CBCBCB;
			}

			&:after {
				content: ' ';
				width: 150rpx;
				height: 1rpx;
				background: #CBCBCB;
			}

			text {
				color: #999999;
				font-size: 26rpx;
				margin: 0 20rpx;
			}
		}

		.login-method {
			display: flex;
			justify-content: center;
			margin-top: 20rpx;

			.wechat-login {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;

				.wechat-icon {
					width: 110rpx;
					height: 110rpx;
				}

				text {
					color: #666666;
					font-size: 26rpx;
				}
			}
		}

	}

	.agreement-part {
		position: absolute;
		left: 0;
		bottom: 60rpx;
		width: 100%;
		font-size: 26rpx;
		color: #999999;
		text-align: center;

		.agreement {
			color: #FC1E1E;
			border-bottom: 1rpx solid #FC1E1E;
		}
	}

	.login-register {
		display: flex;
		justify-content: center;
		margin-top: 33rpx;

		.mobile-login {
			color: #2D2D2D;
			font-size: 28rpx;
			line-height: 34rpx;
			border-right: 1px solid rgba(0, 0, 0, .1);
			padding-right: 30rpx;
			margin-right: 30rpx;
		}

		.register {
			color: #FC1C1C;
			font-size: 28rpx;
			line-height: 34rpx;
		}
	}
	.input-item1 {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
	}
	.avatar{
		width: 100%;
		height: 25px;
	}
</style>
