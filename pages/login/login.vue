<template>
	<view class="login_container">
		<!-- <navigationBar text="登陆"></navigationBar> -->
		<!-- <text class="back-btn iconfont iconziyuan2" @click="navBack"></text> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
			<view class="login-title">
				{{$L('普通登录')}}
			</view>
			<view class="input-content">
				<view class="input-item">
					<input type="text" :value="mobile" @click="hideBottomInfo" :placeholder="$L('请输入账号')" @blur="showBottomInfo" data-key="mobile" @input="inputChange"
					 @focus="setFocus" />
					<text class="clear-account iconfont iconziyuan34" v-show="mobile&&curFocus=='mobile'" @click="clearContent('mobile')"></text>
				</view>
				<view class="input-item pwd_wrap">
					<input type="text" :value="password" @click="hideBottomInfo" :placeholder="$L('请输入密码')" :password="!showPwd" @blur="showBottomInfo" data-key="password"
					 @input="inputChange" @confirm="toLogin" @focus="setFocus" />
					<view class="pwd-right">
						<text class="clear-pwd iconfont iconziyuan34" v-show="password&&curFocus=='password'" @click="clearContent('password')"></text>
						<text :class="pwdState" @click="changePwdState"></text>
						<!-- <text class="forget-pwd" @click.stop="navTo('/pages/public/forgetPwd',2)">忘记密码</text> -->
					</view>

				</view>
			</view>
			<view class='remember_password'>
				<text class='remember_text'>{{$L('忘记密码')}}</text>
				<text class="mobile-login" @click="navTo('/pages/forget_password/forget_password',2)">{{$L('verification_code_sms')}}</text>
			</view>
			<button class="confirm-btn" @click="toLogin">{{$L('登录')}}</button>
			<view class="login-register">
				<text class='register_text'>{{$L('register_text')}}</text>
				<text class="register" @click="navTo('/pages/register/registerel',1)">{{$L('用户注册')}}</text>
			</view>
		</view>
		<view class="other-login" v-if="facebook_isuse==1||instagram_isuse==1||tiktok_isuse==1">
			<view class="title">
				<text>{{$L('其他登录')}}</text>
			</view>
			<view class="login-method">
				<view class="wechat-login" @tap="tripartite(1)" v-if="facebook_isuse==1">
					<image class="wechat-icon" src="https://www.movisunshop.com/mall/views/images/facebook.png" mode="aspectFill" />
					<text>Facebook</text>
				</view>
				<view class="wechat-login" @tap="tripartite(2)" v-if="instagram_isuse==1">
					<image class="wechat-icon" src="https://www.movisunshop.com/mall/views/images/insragram.jpeg" mode="aspectFill" />
					<text>Instagram</text>
				</view>
				<view class="wechat-login" @tap="tripartite(3)" v-if="tiktok_isuse==1">
					<image class="wechat-icon" src="https://www.movisunshop.com/mall/views/images/tiktok.png" mode="aspectFill" />
					<text>Tiktok</text>
				</view>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<!-- button class="wechat-login" @tap="getUserProfile" v-if="canIUseGetUserProfile">
				<image class="wechat-icon" :src="img_url + 'wechat_login.png'" mode="aspectFill" />
				<text>{{$L('微信登录')}}</text>
			</button>
			<button class="wechat-login" open-type="getUserInfo" @getuserinfo="getUser" v-if="!canIUseGetUserProfile">
				<image class="wechat-icon" :src="img_url + 'wechat_login.png'" mode="aspectFill" />
				<text>{{$L('微信登录')}}</text>
			</button> -->
			<!-- #endif -->
			<!-- #ifdef APP-PLUS || H5 -->
			<!-- <view class="login-method">
				<view class="wechat-login" @tap="quickLogin">
					<image class="wechat-icon" :src="img_url + 'wechat_login.png'" mode="aspectFill" />
					<text>{{$L('微信登录')}}</text>
				</view>
			</view> -->
			<!-- #endif -->
		</view>

		<!-- 授权成功后弹层 -->
		<view :class="'sld-success-wrap-new ' + (showModal?'on':'')" v-if="showModal">
			<view class="sld-success">
				<view class="sld-success-title">{{$L('是否绑定已有账号')}}</view>
				<view class="sld-success-content">{{$L('绑定已有账号可以同步历史订单，购物车等数据；不绑定后续数据无法同步')}}</view>
				<view class="sld-btns">
					<button @tap="cancelBindHandle">{{$L('暂不')}}</button>
					<button class="confirm" @tap="confirmBindHandle">{{$L('去绑定')}}</button>
				</view>
			</view>
		</view>

		<!-- 注册成功弹层 -->
		<view class="sld-success-wrap" v-if="regWrapShow">
			<view class="sld-reg-success">
				<view class="sld-reg-close" @tap="closeRegWrap">
					<image :src="img_url+'reg_voucher_close.png'"></image>
				</view>
				<view data-url="/pages/red/red" class="navigator" @tap="goVoucher">
					<image :src="red_img?red_img:'https://www.slodon.cn/static/defualt_img/sld_wap_new_reg_red.png'" mode="widthFix"></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import navigationBar from "../../component/navigationBar/navigationBar";
	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				mobile: '',
				password: '',
				logining: false,
				showPwd: false,
				curFocus: '', //当前光标所在的位置
				showModal: false,
				key: "",
				regWrapShow: false,
				red_img: '',
				otherLoginInfo: {}, //三方登录的信息
				share_u: '',
				inputing: false,
				windowHeight: '',
				showOtherFlag:false,//是否展示三方登录，默认不展示，普通浏览器不展示，其他都展示
				isWeiXinBrower:false,//是否是微信浏览器
				check_agreement: false,
				show_check_icon: getApp().globalData.img_url+'register_uncheck.png',
				canIUseGetUserProfile: false,//是否可以使用getUserProfile获取用户信息，用于微信小程序
				is_show:'',
				facebook_isuse:'',
				instagram_isuse:'',
				tiktok_isuse:'',
			}
		},
		components: {
			navigationBar,
		},
		onLoad() {
			this.getshow()
			//#ifdef MP-WEIXIN
			if (uni.getUserProfile) {
			    this.canIUseGetUserProfile = true;
			}
			//#endif
			this.isWeiXinBrower=this.$isWeiXinBrower()
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight;
				}
			});
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
		computed: {
			pwdState: function() {
				return {
					'pwd-tab': true,
					iconfont: true,
					iconziyuan81: this.showPwd,
					iconziyuan9: !this.showPwd,
				}
			}
		},
		methods: {
			
				//开关
				getshow(){
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=index&mod=shenhe',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: res => {
							this.facebook_isuse = res.data.datas.facebook_isuse;
							this.instagram_isuse = res.data.datas.instagram_isuse;
							this.tiktok_isuse = res.data.datas.tiktok_isuse;
						}
					});
				},
			//注册协议点击事件
			checkAgrement() {
				this.check_agreement = !this.check_agreement;
				this.show_check_icon = this.check_agreement ? getApp().globalData.img_url+'register_checked.png' : getApp().globalData.img_url+'register_uncheck.png';
			},
			showBottomInfo(){
				this.inputing=false
			},
			hideBottomInfo(){
				this.inputing=true
			},
			agreement() {
				uni.navigateTo({
					url: '/pages/privacyPolicy/privacyPolicy'
				})
			},
			tripartite(type) {
				//facebook
				if(type==1){
					uni.request({
					  url: getApp().globalData.ser_url + '/index.php?app=login&mod=facebook_y',
					 
					  success: res => {		
					    if (res.data.state == 200) {
							location.href = res.data.date
					    } 
					  },
					});
					// ins
				}else if (type==2){
					uni.request({
					  url: getApp().globalData.ser_url + '/index.php?app=login&mod=instagram_y',
					 
					  success: res => {		
					    if (res.data.state == 200) {
							location.href = res.data.date
					    } 
					  },
					});
				}else if (type==3){
					uni.request({
					  url: getApp().globalData.ser_url + '/index.php?app=login&mod=tiktok_y',
					 
					  success: res => {		
					    if (res.data.state == 200) {
							location.href = res.data.date
					    } 
					  },
					});
				}
			},
			//授权登录
			quickLogin (){
				// #ifdef APP-PLUS
				if (!this.check_agreement) {
					uni.showToast({
						title: this.$L('请同意用户隐私政策!'),
						icon: 'none'
					});
					return false;
				}
				// #endif
				let _this = this;
				//#ifdef APP-PLUS
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					if(loginRes.errMsg == 'login:ok'){
						//授权登录成功
						// 获取用户信息
						    uni.getUserInfo({
						      provider: 'weixin',
						      success: function (infoRes) {
								let tar_params = {};
								tar_params.unionid = loginRes.authResult.unionid;
								tar_params.openid = loginRes.authResult.openid;
								tar_params.avator = infoRes.userInfo.avatarUrl;
								tar_params.nickname = infoRes.userInfo.nickName;
								tar_params.registerId =  uni.getStorageSync('clientid')?uni.getStorageSync('clientid'):'44bfe527878890876515dcfe0564f1b4';
								tar_params.client  =  uni.getSystemInfoSync().platform;
								//根据unionid判断是否是会员
								uni.request({
									url: getApp().globalData.ser_url + '/index.php?app=login&mod=app_wechat_isexit_mem',
									method: 'POST',
									data: tar_params,
									header: {
										'Content-Type': 'application/x-www-form-urlencoded'
									},
									success: res => {
										if (res.data.state == 100) {
											let u = uni.getStorageSync('share_u');
											if (u) {
											  _this.share_u = u;
											}
											uni.setStorageSync('otherLoginInfo', tar_params);
											//新账号，提示是否绑定旧账号
											_this.otherLoginInfo = {...tar_params}
											_this.showModal = true;
										} else if (res.data.state == 200) {
											//已经绑定，直接登陆
											uni.setStorageSync('token', res.data.data.key);
											setTimeout(() => {
											  uni.switchTab({
											    url: '/pages/user/user'
											  });
											}, 1500);
										}else {
											uni.showToast({
												title: res.data.msg,
												icon: 'none'
											});
										}
									}
								});
						      }
						    });
						
					}
				  }
				});
				//#endif
				//#ifdef H5
				let isWexin = this.$isWeiXinBrower();
				if(isWexin){
					let uricode = getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_login&ukey=' + uni.getStorageSync('uuid');
					if(location.href.indexOf('#')>-1){
						let splitData = location.href.split('#');
						uricode += '&sld_referrer_url='+splitData[0]+'&sld_referrer_url_after=/pages/user/user';
					}
					uricode = encodeURIComponent(uricode)
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+getApp().globalData.h5_appid+'&redirect_uri=' + uricode + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
				}
				//#endif
			},
			
			getUser(e) {
			  if (e.detail.errMsg == "getUserInfo:ok") {
			    let userinfo = e.detail.userInfo;
				this.getWxXcxCoce(userinfo,e.detail)
			  }
			},
			
			getUserProfile(e) {
			   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
			   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
			   uni.getUserProfile({
			     desc: this.$L('用于完善个人信息'), // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			     success: (res) => {
					  if(res.errMsg == "getUserProfile:ok"){
						  let userinfo = res.userInfo;
						  this.getWxXcxCoce(userinfo,{encryptedData:res.encryptedData,iv:res.iv,rawData:res.rawData,siguature:res.siguature});
					  }
			     }
			   })
			 },
			
			//微信小程序根据用户信息获取code
			getWxXcxCoce(userinfo,jmData) {
          var that = this
				uni.showLoading({
				  title: that.$L('正在请求...'),
				  mask: true
				});
				uni.login({
				  success: code => {
					let cart_list_storage = uni.getStorageSync('cart_list_storage');
					var str = "";
					if (cart_list_storage) {
					  cart_list_storage.map((item, index) => {
					    item[2].map((item1, index1) => {
					      if (str == '') {
					        str = item1.gid + ',' + item1.goods_num;
					      } else {
					        str = str + '|' + (item1.gid + ',' + item1.goods_num);
					      }
					    });
					  });
					}
				        let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
						let spreader = '';
						let time = 0;
						let inviteid =uni.getStorageSync('share_u')
						if (tsGoodsInfo) {
						  for (let key in tsGoodsInfo) {
						    if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
						      spreader = tsGoodsInfo[key].shareId;
						      time = tsGoodsInfo[key].ssys_expire_day_time * 1;
						    }
						  }
						}
				    uni.request({
				      url: getApp().globalData.ser_url + '/index.php?app=login&mod=xcx_login',
				      data: {
				        code: code.code,
				        userinfo: userinfo,
				        goods_cart: str,
						jmData: jmData,
						ukey:wx.getStorageSync('uuid'),
						shareId:spreader?spreader:'',
				      },
				      success: res => {
				
				        if (res.data.data.state == 200) {
				          uni.setStorageSync('token', res.data.data.token);
				          let fromurl = uni.getStorageSync('fromurl');
				          if (fromurl) {
				            uni.removeStorage({
				              key: 'fromurl',
				              success: function (res) {}
				            });
				            uni.navigateTo({
				              url: fromurl
				            });
				          }else{
							  uni.switchTab({
							    url: '/pages/user/user'
							  });
						  }
				        } else if (res.data.data.state == 100) {
				          this.setData({
				            showModal: true,
				            keys: res.data.data.reinfo.keys
				          });
				        } else {}
				      },
				      complete: () => {
				        uni.hideLoading();
				      }
				    });
				  }
				});
			},
			
			//确认绑定页面
			confirmBindHandle() {
				let _this = this;
			  const {
			    keys
			  } = _this;
			  
			  _this.showModal = false;
			  uni.navigateTo({
			    url: '/pages/bindAccount/bindAccount?keys=' + keys
			  });
			},
			
			//暂不绑定，注册新账号
			cancelBindHandle(){
				let {otherLoginInfo,share_u} = this;
				let _this = this;
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
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=app_auto_register',
					method: 'POST',
					data: {
						client:otherLoginInfo.client,
						unionid:otherLoginInfo.unionid,
						openid:otherLoginInfo.openid,
						avator:otherLoginInfo.avator,
						nickname:otherLoginInfo.nickname,
						registerId: otherLoginInfo.registerId,
						shareId:spreader,
						ukey:uni.getStorageSync('uuid'),
						inviteid:share_u,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						if (res.data.state == 200) {
							uni.setStorageSync('token', res.data.data.key);
							//注册成功
							let fromurl = uni.getStorageSync('fromurl');
							if (fromurl) {
							  if (res.data.data.red_money * 1 > 0) {
							    uni.setStorageSync('red_money', res.data.data.red_money);
							  }
							
							  if (res.data.data.red_img) {
							    uni.setStorageSync('red_img', res.data.data.red_img);
							  }
							  uni.removeStorage({
							    key: 'fromurl',
							    success: function (res) {}
							  });
							  uni.removeStorage({
							    key: 'share_u',
							    success: function (res) {}
							  });
							  _this.showModal = false;
							  uni.navigateTo({
							    url: fromurl
							  });
							} else {
								uni.switchTab({
									url: '/pages/user/user'
								});
							  // if (res.data.data.red_money > 0) {
							  //   _this.setData({
							  //     regWrapShow: true,
							  //     red_img: res.data.data.red_img ? res.data.data.red_img : ''
							  //   });
							  // }
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
			
			closeRegWrap() {
				this.regWrapShow = false;
			},
			
			goVoucher(e) {
			  let url = e.currentTarget.dataset.url;
			  if (url) {
				  this.regWrapShow = false;
			    uni.navigateTo({
			      url: url
			    });
			  }
			},
			
			// ...mapMutations(['login', 'setUserCenterData']),
			//光标聚焦事件
			setFocus(e) {
				this.hideBottomInfo()
				this.curFocus = e.currentTarget.dataset.key;
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toLogin() {
				if (this.password == '' || this.username == '') {
					return;
				}
				// #ifdef APP-PLUS
				if (!this.check_agreement) {
					uni.showToast({
						title: this.$L('请同意用户隐私政策!'),
						icon: 'none'
					});
					return false;
				}
				// #endif
				let cur_client = '';
				// #ifdef APP-PLUS
				cur_client = uni.getSystemInfoSync().platform;
				// #endif
				// #ifdef MP-WEIXIN
				cur_client = 'wx_xcx';
				// #endif
				// #ifdef H5
				cur_client = 'wap';
				// #endif
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
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=login&mod=index',
					method: 'POST',
					data: {
						username: this.mobile,
						password: this.password,
						client: cur_client,
						shareId:shareId?shareId:'',
						registerId : uni.getStorageSync('clientid')?uni.getStorageSync('clientid'):'44bfe527878890876515dcfe0564f1b4'
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						if (!res.data.datas.error) {
							if (typeof res.data.datas.key == 'undefined') {
								return false;
							} else {
								uni.showToast({
									title: this.$L('登录成功')
								});
								uni.setStorageSync('token', res.data.datas.key);
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

	.login_container {
		/* padding-top: 19.2vh; */
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
		color: #2D2D2D;
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
		margin-bottom: 16rpx;
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
			width: 100%;
			color: #2D2D2D;
			height: 60upx;
			font-size: $font-base;
			color: $font-color-dark;
		}

		.clear-account {
			position: absolute;
			right: 6rpx;
			top: 28rpx;
			font-size: 26rpx;
			color: #ddd;
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
	}


	.confirm-btn {
		width: 620rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 90rpx;
		border-radius: 6rpx;
		color: #fff;
		font-size: 30rpx;
		background-color:#1E2A74;
	}

	.other-login {
		position: absolute;
		left: 0;
		bottom: 300rpx;
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

		}

		.wechat-login {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 25%;
			background-color: white;
            &::after {
					border: none;
				}
            

			text {
				color: #666666;
				font-size: 26rpx;
			}
		}

		.wechat-icon {
			width: 80rpx;
			height: 80rpx;
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
		flex-direction: column;
		.register_icon {
			width: 46rpx;
			height: 46rpx;
		}
		.agreement {
			color: #1E2A74;
			border-bottom: 1rpx solid #1E2A74;
		}
	}
	.remember_password{
		padding: 0 64rpx;
		font-size: 14px;
		.remember_text{
			color: grey;
		}
		.mobile-login {
			color: #1e2a74;
			text-decoration: underline;
		}
	}
	.login-register {
		padding: 0 64rpx;
		margin-top: 33rpx;
		text-align:center;
		font-size: 14px;
		.register_text{
			color: grey;
		}
		.register {
			color: #1e2a74;
			text-decoration: underline;
		}
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
		background: linear-gradient(90deg, rgba(252, 31, 29, 1) 0%, rgba(253, 115, 38, 1) 100%);
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

	.sld-reg-success {
		position: relative;
	}

	.sld-reg-success .sld-reg-close {
		position: absolute;
		top: -56rpx;
		right: 20rpx;
		width: 56rpx;
		height: 56rpx;
	}

	.sld-reg-success .sld-reg-close image {
		width: 100%;
		height: 100%;
	}

	.sld-reg-success navigator image {
		width: 514rpx;
		height: 0;
	}

	.sld-reg-success .navigator image {
		width: 514rpx;
		height: 0;
	}

	.fixed_top_status_bar {
		position: fixed;
		/* #ifdef APP-PLUS */
		height: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		height: 0;
		/* #endif */
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
		background: #fff;
	}

	.fixed {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		left: 0;
		width: 750rpx;
		height: 102rpx;
		z-index: 99;
		animation: fade 0.3s;
	}

	.fixed.member-top .setting {
		top: 16rpx;
		animation: fade 0.3s;
	}

	.fixed .member-bg {
		height: 102rpx;
		top: 0;
	}

	.fixed .member-base-info {
		top: 20rpx;
		left: 20rpx;
		height: 62rpx;
	}

	.fixed .member-base-info .user-avatar {
		width: 62rpx;
		height: 62rpx;
		border-width: 5rpx;
	}

	.fixed .member-base-info .user-avatar2 {
		border-width: 5rpx;
	}

	.fixed .user-avatar2 image {
		width: 52rpx;
		height: 0;
	}

	.fixed .user_new_info .user-name {
		font-weight: normal;
		font-size: 24rpx;
	}

	.fixed .user_new_info .user-name text {
		font-size: 16rpx;
	}

	.mt102 {
		margin-top: 102rpx;
	}

	.user_new_info .user-name .user-info-name-txt {
		max-width: 240rpx;
		font-size: 30rpx;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@keyframes fade {
		0% {
			opacity: 0.3;
		}

		100% {
			opacity: 1;
		}
	}
	.avatar{
		width: 100%;
		height: 25px;
	}
</style>
