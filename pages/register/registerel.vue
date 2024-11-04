<!-- 注册页面 -->
<template>
	<view class="forget_container">
		<!-- <text class="back-btn iconfont iconziyuan2" @click="navBack"></text> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
      <view class="" style="display: flex;">   
			<view class="login-title">
				{{$L('邮箱注册')}}
			</view>
			  <!-- <view class="login-title1" @click="navTo('/pages/register/register',1)">
				{{$L('手机注册')}}
			  </view> -->
      </view>
			<view class="input-content">
				<view class="input-item">
					<input type="text" :value="email" :placeholder="$L('请输入邮箱')" data-key="email" @input="inputChange"
					 @focus="setFocus" />
					<text class="clear-account iconfont iconziyuan34" v-show="email&&curFocus=='email'" @click="clearContent('email')"></text>
				</view>
				<view class="input-item">
					<input type="text" :value="imgCode" maxlength="5" :placeholder="$L('请输入图形验证码')" data-key="imgCode" @input="inputChange"
					 @focus="setFocus" />
					<view class="pwd-right">
						<text class="clear-pwd iconfont iconziyuan34" v-show="imgCode&&curFocus=='imgCode'" @click="clearContent('imgCode')"></text>
						<image @click="getImgCode" :src='showCodeImg' />
					</view>
				</view>
				<view class="input-item">
					<input type="number" :value="smsCode" maxlength="6" :placeholder="$L('请输入邮箱验证码')" data-key="smsCode" @input="inputChange"
					 @confirm="toRegist" @focus="setFocus" />
					<view class="pwd-right">
						<text class="clear-pwd iconfont iconziyuan34" v-show="smsCode&&curFocus=='smsCode'" @click="clearContent('smsCode')"></text>
						<view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
							<text class="sms-code">{{countDownM?`${countDownM}s`+$L('后重新获取'):$L('获取验证码')}}</text>
						</view>
					</view>
				</view>
				<view class="input-item">
				<input type="text" :value="password" :placeholder="$L('请设置您的密码')" maxlength="11" data-key="password" @input="inputChange"
					 @focus="setFocus" />
					<text class="clear-account iconfont iconziyuan34" v-show="password&&curFocus=='password'" @click="clearContent('password')"></text>
				</view>
			</view>
			<button class="confirm-btn" @click="toRegist" :style="{opacity: (!(check_agreement&&email&&smsCode&&imgCode)||logining)?0.5:1}">{{$L('注册')}}</button>
			<view class="login-register">
				<text class="mobile-login">{{$L('已有账号～')}}</text>
				<text class="register" @click="navTo('/pages/login/login',1)">{{$L('去登陆>')}}></text>
			</view>
		</view>
		<view class="other-login" v-if="showOtherFlag">
			<view class="title">
				<text>{{$L('其他登录')}}</text>
			</view>
			<view class="login-method">
				<view class="wechat-login">
					<image class="wechat-icon" :src="img_url+'wechat_login.png'" mode="aspectFill" />
					<text>{{$L('微信登录')}}</text>
				</view>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<view class="agreement-part flex_row_center_center" :style="!isWeiXinBrower?'bottom:120rpx':''">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="agreement-part flex_row_center_center">
		<!-- #endif -->
			<image @click="checkAgrement" class="register_icon" :src="show_check_icon" mode="aspectFill" />
			{{$L('我已阅读并同意')}}
			<text class="agreement" @click="agreement">{{$L('《用户注册协议及隐私政策》')}}</text>
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
				smsCode: '',
				showCodeImg: '',
				imgCode: '', //图形验证码
				imgCodeKey: '', //图形验证码的key
				logining: false,
				check_agreement: false,
				show_check_icon: getApp().globalData.img_url + 'register_uncheck.png',
				countDownM: 0, //短信验证码倒计时	
				timeOutId: '', //定时器的返回值
				curFocus: '', //当前光标所在的位置
				img_url: getApp().globalData.img_url,
				password: '',
				showOtherFlag:false,//是否展示三方登录，默认不展示，普通浏览器不展示，其他都展示
				isWeiXinBrower:false,//是否是微信浏览器
				email:'',
			}
		},
		onLoad() {
			this.isWeiXinBrower=this.$isWeiXinBrower()
			this.getImgCode();
			// #ifdef H5
			if(!this.$isWeiXinBrower()){
				this.showOtherFlag = false;
			}else{
				this.showOtherFlag = true;
			}
			//#endif
			// #ifdef APP-PLUS||MP-WEIXIN
				this.showOtherFlag = true;
			//#endif
		},

		methods: {
			// ...mapMutations(['login', 'setUserCenterData']),
			//光标聚焦事件
			setFocus(e) {
				this.curFocus = e.currentTarget.dataset.key;
			},
			getImgCode() {
				//获取图形验证码
				this.showCodeImg = getApp().globalData.ser_url + '/index.php?app=randcode' + "&rand=" + Math.random()
			},
			//注册协议点击事件
			checkAgrement() {
				this.check_agreement = !this.check_agreement;
				this.show_check_icon = this.check_agreement ? getApp().globalData.img_url + 'register_checked.png' : getApp().globalData
					.img_url + 'register_uncheck.png';
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			agreement(){
				uni.navigateTo({
					url:'/pages/privacyPolicy/privacyPolicy'
				})
			},
			toRegist() {
				const {
					email,
					smsCode,
					imgCode,
					imgCodeKey,
					logining
				} = this;
				if (!(email && smsCode && imgCode) || logining) {
					return;
				}
				if (!this.check_agreement) {
					uni.showToast({
						title: this.$L('请同意用户注册协议及隐私政策'),
						icon: 'none'
					});
					// this.$api.msg('请同意用户注册协议及隐私政策!');
					return false;
				}
				let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
				let shareId = '';
				let time = 0;
				if (tsGoodsInfo) {
				  for (let key in tsGoodsInfo) {
				    if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
				      shareId = tsGoodsInfo[key].shareId;
				      time = tsGoodsInfo[key].ssys_expire_day_time * 1;
				    }
				  }
				}
				let inviteid =uni.getStorageSync('share_u')
				this.logining = true;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login_mobile&mod=mobileregister_email',
					method: 'POST',
					data: {
						'email': this.email,
						'password':this.password,
						'client':'wap',
						'inviteid': inviteid?inviteid:'',
						'client': 'wx_xcx' ,
						'shareId':shareId?shareId:'',
						'ukey': uni.getStorageSync('uuid'),
						'email_code':smsCode
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
								title: this.$L('注册成功'),
								icon: 'none'
							});
						    setTimeout(()=>{
								uni.redirectTo({
									url:'/pages/login/login'
								})
							},1500) 
						}
					}
				});
			},
			//清空输入的内容
			clearContent(type) {
				this[type] = '';
			},

			//获取短信验证码
			getSmsCode() {
				if (this.countDownM) {
					return;
				}
				var reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
				if (this.email == "") {
					uni.showToast({
						title: this.$L('请输入邮箱'),
						icon: 'none'
					});
					return
				} else if (!reg.test(this.email)) {
					uni.showToast({
						title: this.$L('邮箱格式不正确，重新输入！'),
						icon: 'none'
					});
					return
				} else if (!this.imgCode) {
					uni.showToast({
						title: this.$L('请输入图形验证码!'),
						icon: 'none'
					});
					return
				} else {

					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=login&mod=SendMail',
						method: 'POST',
						data: {
							'email': this.email,
							'type': '1',
							'email_code': this.imgCode,
							'sldcode': 'yhgeaq08',
							'client': 'wx_xcx' 
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: res => {

							if (res.data.datas == '200') {
                uni.showToast({
                	title: this.$L('已发送'),
                	icon: 'none'
                });
                	this.countDownM = 60;
                	this.countDown();
								
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none'
								});
							}
						}
					});
					// let param = {};
					// param.url = 'v1/front/commons/smsCode';
					// param.data = {};
					// param.data.verifyType = 2;
					// param.data.verifyAddr = this.mobile;
					// param.data.type = 'reg';
					// param.data.verifyCode = this.imgCode;
					// param.data.verifyKey = this.imgCodeKey;
					// this.$request(param).then(res => {
					// 	this.$api.msg(res.msg)
					// 	if (res.state == 200) {
					// 		this.countDownM = 60;
					// 		this.countDown();
					// 	}
					// })
					
				}
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
			//倒计时
			countDown() {
				this.countDownM--;
				if (this.countDownM == 0) {
					clearTimeout(this.timeOutId);
				} else {
					this.timeOutId = setTimeout(this.countDown, 1000);
				}
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
		width: 750rpx;
		margin: 0 auto;
		height: 100vh;
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
		margin-top: 90rpx;
		margin-bottom: 70rpx;
		margin-left: 65rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;

		&:after {
			position: absolute;
			left: 0;
			bottom: -10rpx;
			content: '';
			width: 76rpx;
			height: 6rpx;
			background: linear-gradient(90deg, rgba(252, 28, 28, 1) 0%, rgba(255, 138, 0, 0) 100%);
		}
	}
  .login-title1{
    position: relative;
    margin-top: 90rpx;
    margin-bottom: 70rpx;
    margin-left: 65rpx;
    font-size: 36rpx;
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
				top: 14rpx;
				display: flex;
				align-items: center;

				.clear-pwd {
					font-size: 26rpx;
					color: #ddd;
				}

				image {
					width: 128rpx;
					height: 50rpx;
					box-shadow: 0px 5rpx 9rpx 1rpx rgba(102, 102, 102, 0.1);
					border-radius: 6rpx;
					margin-left: 20rpx;
				}
			}
		}

		&:nth-child(3) {
			/* margin-bottom: 0; */

			.pwd-right {
				position: absolute;
				right: 6rpx;
				top: 6rpx;
				display: flex;
				align-items: center;

				.clear-pwd {
					font-size: 26rpx;
					color: #ddd;
				}

				.sms-code-view {
					border: 1px solid $main-color;
					padding: 14rpx;
					border-radius: 6rpx;
					line-height: 0;
					margin-left: 20rpx;

					.sms-code {
						color: $main-color;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
		}

		&:nth-child(4) {
			margin-bottom: 0;
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
		}
	}


	.confirm-btn {
		width: 620rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 90rpx;
		background: linear-gradient(90deg, rgba(252, 31, 29, 1) 0%, rgba(253, 115, 38, 1) 100%);
		box-shadow: 0px 3rpx 14rpx 1rpx rgba(253, 38, 29, 0.26);
		opacity: 0.7;
		border-radius: 44rpx;
		color: #fff;
		font-size: 36rpx;
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

		.register_icon {
			width: 46rpx;
			height: 46rpx;
		}

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
			color: #949494;
			font-size: 28rpx;
			line-height: 34rpx;
		}

		.register {
			color: #FC1C1C;
			font-size: 28rpx;
			line-height: 34rpx;
		}
	}
</style>
