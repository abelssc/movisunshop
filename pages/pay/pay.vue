<template>
	<view>
		<view class="pay" v-if="payMode.length">
			<view class="pay_type">
				<view class="title">{{$L('选择支付方式')}}</view>
				<view class="type">
					<radio-group @change="changePaymode">
						<label v-for="(item, index) in payMode" :key="index" :class="'item ' + ((disable&&item.payment_code=='predeposit')?'disable':'')"
						 :for="item.payment_code">
							<view class="type_left">
								<view class="img">
									<image :src="img_url+item.url" mode="widthFix"></image>
								</view>
								<view>
									<view>{{item.payment_name}}</view>
									<view class="dis" v-if="disable&&item.payment_code=='predeposit'">{{$L('余额不足 可用余额')}}{{$L('￥')}}{{predepoit}}</view>
								</view>
							</view>
							<view class="type_right">
								<radio :id="item.payment_code" :value="item.payment_code" color="#FC8800" :checked="payment_code==item.payment_code"
								 :disabled="disable&&item.payment_code=='predeposit'"></radio>
							</view>
						</label>
					</radio-group>
				</view>
			</view>

			<view class="goPay" v-if="payment_code != 'pay-me'">
				<button @tap="pay">{{$L('确定')}}</button>
			</view>
		</view>

		<view class="pw-wrap" v-if="show">
			<view class="pw-modal">
				<view class="pw-title">
					<text>{{$L('请输入支付密码')}}</text>
					<view class="modal-close" @tap="hidePayType">
						<image src="/static/images/pwclose.png"></image>
					</view>
				</view>

				<view class="modal-main">
					<input type="password" :value="pw" @input="getpw" :focus="focus"></input>
					<navigator open-type="redirect" url="/pages/setpw/setpw" hover-class="none">
						<text>{{$L('忘记密码？去找回密码')}}</text>
					</navigator>
					<button @tap="pay">{{$L('确定')}}</button>
				</view>
			</view>
		</view>

		<view v-if="isloading && !payMode.length">
			<block data-type="template" data-is="not" data-attr="img,content">
				<view class="nothasData">
					<view class="img">
						<image :src="img"></image>
					</view>
					<text>{{content}}</text>
				</view>
			</block>
		</view>
		
		<!-- 动态创建的form表单区域 -->
		<view id="formModel" class="goPay" v-show="payment_code == 'pay-me'">
		</view>

		<common :title="$L('支付')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img: getApp().globalData.img_url + "order_w.png",
				content: this.$L('平台没有开启支付方式，请稍后再试'),
				key: '',
				payment_code: '',
				predepoit: '',
				//余额
				pay_sn: '',
				price: '',
				// 订单合计价格
				disable: '',
				// 余额是否充足
				focus: false,
				// 密码框获得焦点
				show: false,
				// 密码输入框显示隐藏
				pw: '',
				// 密码
				isloading: false,
				orderid: '',
				payMode: "",
				img_url: getApp().globalData.img_url,
				payFrom: "other",
				payMeInfoList: []
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('选择支付方式')
      });
			var key = uni.getStorageSync('token');


			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			} // 订单号


			let pay_sn = options.sn;
			let price = options.price;
			if (options.payFrom) {
				this.payFrom = options.payFrom
			}
			this.setData({
				pay_sn,
				price
			});

			if (options.orderid) {
				this.setData({
					orderid: options.orderid
				});
			}

			this.getPaymode(); //  获取支付方式

			this.getMyAvailable(); // 获取余额
		},
		methods: {
			// 获取支付方式
			getPaymode() {
				let that = this,
					key = that.key;
				let client = '';
				//#ifdef APP-PLUS
				client = 'app';
				//#endif
				//#ifdef H5
				let browerFlag = this.$isWeiXinBrower();
				client = browerFlag ? 'h5_weixin' : 'h5_brower';
				//#endif
				//#ifdef MP-WEIXIN
				client = 'xcx';
				//#endif
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=common&mod=getPaymentList',
					method: 'GET',
					data: {
						paytype: 'product_buy',
						client: client,
						sn:that.pay_sn,
						orderid:that.orderid,
						key: key
					},
					success: function(res) {
						if (res.data.state == 200) {
							let dat = res.data.data;
							dat.map(el => {
								if (el.payment_code == 'predeposit') {
									el.url = 'yepay.png';
								}

								if (el.payment_code == 'mini_wxpay') {
									el.url = 'wxpay.png';
								}

								if (el.payment_code == 'alipay') {
									//支付宝支付
									el.url = 'zifubao@2x.png';
								}
								if (el.payment_code == 'weixin' || el.payment_code == 'wxpay_jsapi' || el.payment_code == 'wxpay_h5api') {
									//微信支付
									el.url = 'Group4@2x.png';
								}
								
								if (el.payment_code == 'paypal') {
									el.url = 'paypal.png';
								}
								
								if (el.payment_code == 'pay-me') {
									el.url = 'pay-me.png';
									that.payMeInfoList = []
									for(key in el.pay) {
										let payMeItem = {
											name: key,
											value: el.pay[key]
										}
										that.payMeInfoList.push(payMeItem)
									}
									that.creatFormModel()
								}
							});
							let indexx = 0;

							for (let i = 0; i < dat.length; i++) {
								if (dat[i].payment_code == 'predeposit') {
									indexx = i;
									break;
								}
							}
							

							dat.push(dat.splice(indexx, 1)[0]);
							that.setData({
								payMode: dat,
								payment_code: dat[0].payment_code,
								isloading: true
							});
						} else {
							that.setData({
								isloading: true
							});
						}
					}
				});
			},
			
			creatFormModel() {
				let fromModel = document.getElementById('formModel');
				let inputList = ''
				for(let i = 0; i < this.payMeInfoList.length; i++ ) {
					inputList += `<input style="display:none;" type="text" name="${this.payMeInfoList[i].name}" value="${this.payMeInfoList[i].value}" />`
				}
				let fromInputNode = 
				`
				<form  name="f1" id="f1" action="#" method="post" class="alignet-form-vpos2 goPay">
					${inputList}
					<input style="width: 100%; height: 60px; background-color: #e74310;color: #fff;font-size: 17px; line-height: 60px;letter-spacing: 5px;border-radius: 0; border:none; text-align:center;" type="submit" onclick="javascript:AlignetVPOS2.openModal('https://integracion.alignetsac.com/','[DesignType]')" value="${this.$L('确定')}">
				</form>
				`
				fromModel.innerHTML = fromInputNode
			},

			// 选择充值方式
			changePaymode(e) {
				let mode = e.detail.value;
				this.setData({
					payment_code: mode
				});

				if (mode == 'predeposit') {
					this.memberCanBuy();
				}
			},

			memberCanBuy() {
				let key = this.key;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=testmemberbuy',
					data: {
						key
					},
					success: result => {
						if (result.data.state == 200) {
							this.setData({
								show: true,
								focus: true
							});
						} else {
							uni.showModal({
								title: this.$L('提示'),
								content: result.data.msg + this.$L(',请先设置密码'),
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/setting/setting'
										});
									}
								}
							});
						}
					}
				});
			},

			// 获取用户余额
			getMyAvailable() {
				let that = this,
					key = that.key;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getMyAvailable&key=' + key,
					method: 'GET',

					success(res) {
						let disable = false;

						if (parseFloat(that.price) <= parseFloat(res.data.datas.predepoit)) {
							disable = false;
						} else {
							disable = true;
						}

						that.setData({
							predepoit: res.data.datas.predepoit,
							disable
						});
					},

					error: function(err) {}
				});
			},

			// 隐藏弹出框
			hidePayType(e) {
				this.setData({
					show: false,
					focus: false,
					pw: ''
				});
			},

			// 输入密码
			getpw(e) {
				let pw = e.detail.value;
				this.setData({
					pw
				});
			},


			/** 支付成功及失败页面跳转方法
			 *  支付成功,如果是从订单列表过来，则需要返回订单列表，并通知页面刷新，否则直接跳转订单列表页面	
			 *  支付失败（包含用户取消支付），如果是从订单列表过来，则需要返回订单列表，否则直接跳转订单列表页面
			 */
			paySuccessTips(type) {
				if (this.payFrom == "orderList") {
					if (type == 'success') { //支付成功
						uni.showToast({
							title: this.$L('支付成功!'),
							icon: 'none',
							duration: 700
						})
						const pages = getCurrentPages(); //当前页面栈  
						if (pages.length > 1) {
							const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
							beforePage.$vm.get_order(); //触发上个面中的方法获取订单列表 *get_order为上个页面的方法*
						}
						setTimeout(() => {
							uni.navigateBack({delta:2})
						}, 1000)
					} else if (type == 'fail') { //支付失败
						uni.showToast({
							title: this.$L('支付失败'),
							icon: 'none',
							duration: 700
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				} else {
					uni.redirectTo({
						url: '/pages/order/order'
					});
				}
			},
			


			// 去支付
			pay() {

				let that = this;
				let {
					key,
					payment_code,
					pay_sn,
					pw
				} = that;
        if(payment_code == 'paypal'){
          uni.showToast({
          	title: that.$L('请联系商务'),
          	icon: 'none'
          });
          return;
        }
		
				if (payment_code == 'predeposit') {
					// 余额支付
					if (!that.show) {
						// 未弹出密码框
						this.memberCanBuy();
						return;
					}

					if (!pw) {
						// 未输入密码
						uni.showToast({
							title: that.$L('请输入密码'),
							icon: 'none'
						});
						return;
					}

					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=buy&mod=check_pay_pwd',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							password: pw
						},
						dataType: 'json',
						success: function(res) {
							if (res.data.datas != 'OK') {
								uni.showToast({
									title: res.data.datas.error,
									icon: 'none'
								});
							} else {
								that.goPayByPredeposit(key, pay_sn, payment_code, pw);
							}
						}
					});
				} else if (payment_code == 'mini_wxpay') {
					// 微信小程序支付
					that.goPay(key, pay_sn);
				} else if (payment_code == 'alipay') { //支付宝支付
					//获取支付宝的相关信息
					//支付宝APP支付
					//#ifdef APP-PLUS
					let params = {};
					params.payment_code = payment_code;
					params.key = key;
					params.pay_sn = pay_sn;
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_alipay_app',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: params,
						dataType: 'json',
						success: function(res) {
							if (res.data.datas.status == 0) {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none'
								});
							} else {
								uni.requestPayment({
									provider: 'alipay',
									orderInfo: res.data.datas.result, //订单数据
									success: function(res) {
										that.paySuccessTips('success');
									},
									fail: function(err) {
										that.paySuccessTips('fail');
									}
								});
							}
						}
					});
					//#endif
					//#ifdef H5
					this.goPayByBrower();
					//#endif
				} else if (payment_code == 'weixin') { //微信APP支付
					//获取微信的相关信息
					let params = {};
					params.payment_code = payment_code;
					params.key = key;
					params.pay_sn = pay_sn;
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_weixin_app',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: params,
						dataType: 'json',
						success: function(res) {
							let data = res.data.datas;
							if (data.status == 0) {
								uni.showToast({
									title: data.msg,
									icon: 'none'
								});
							} else {
								uni.requestPayment({
									provider: 'wxpay',
									orderInfo: data.result, //订单数据
									success: function(res) {
										uni.showToast({
											title:  that.$L('支付成功'),
											icon: 'none'
										});
										//支付成功,如果是从订单列表过来，则需要返回订单列表，并通知页面刷新，否则直接跳转订单列表页面
										that.paySuccessTips('success');
									},
									fail: function(err) {
										//支付失败（包含用户取消支付）
										that.paySuccessTips('fail');
									}
								});
							}
						}
					});
				}else if (payment_code == 'wxpay_jsapi'||payment_code == 'wxpay_h5api') {
					this.goPayByBrower();
				}
			},
			
			//浏览器里的支付：普通h5支付宝支付、微信h5微信支付、普通h5微信支付
			goPayByBrower(){
				let {key,pay_sn,pw,payment_code,orderid} = this;
				location.href = getApp().globalData.ser_url + "/index.php?app=pay&mod=pay_new&key=" + key + "&pay_sn=" + pay_sn +
					"&password=" + pw + "&rcb_pay=0&pd_pay=0&payment_code=" + payment_code + '&order_id=' + orderid;
			},

			//余额支付
			goPayByPredeposit(key, pay_sn, payment_code, pw) {
				let that = this;
				uni.showLoading({
					title: that.$L('支付中'),
					mask: true
				});
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_new_app_predision',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key: key,
						pay_sn: pay_sn,
						password: pw,
						pd_pay: 1,
						rcb_pay: 0,
						payment_code: payment_code
					},
					success: function(res) {
						uni.hideLoading();
						if (res.data.state == 200) {
							//支付成功返回订单列表页
							//关闭当前页面进入订单列表页面
							uni.redirectTo({
								url: '../order/order'
							});
							uni.showToast({
								title: that.$L('支付成功')
							});
						} else {
							//支付失败弹出提示
							uni.showToast({
								title: res.data.msg,
								icon:'none',
								duration:700
							});
							setTimeout(()=>{
								that.show = false;
								that.getMyAvailable();
								that.getPaymode();
								that.$forceUpdate();
							},1000)
							
						}
					}
				});
			},

			// 发起支付
			goPay(key, pay_sn, payment_code, pw) {
				let that = this;
				let {
					orderid
				} = this;
				let data = {
					key,
					pay_sn
				};

				if (payment_code) {
					data.payment_code = payment_code;
				}

				if (pw) {
					data.password = pw;
				}

				if (orderid) {
					data.order_id = orderid;
				}

				uni.showLoading({
					title: that.$L('正在请求支付'),
					mask: true
				});
				uni.login({
					success: code => {
						uni.request({
							url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_new_xcx&code=' + code.code,
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							data: data,
							success: function(result) {
								if (result.data.state == 200) {
									if (result.data.info) {
										//调起微信支付
										uni.requestPayment({
											'timeStamp': result.data.info.timeStamp,
											'nonceStr': result.data.info.nonceStr,
											'package': result.data.info.package,
											'signType': 'MD5',
											'paySign': result.data.info.paySign,
											'success': function(res) {
												//关闭当前页面进入订单列表页面
												uni.redirectTo({
													url: '../order/order'
												});
												uni.showToast({
													title: that.$L('支付成功')
												});
											},
											'fail': function(res) {}
										});
									} else {
										uni.showToast({
											title: result.data.msg
										});
										uni.redirectTo({
											url: '../order/order'
										});
									}
								} else {
									uni.showToast({
										title: result.data.msg,
										icon: 'none'
									});
								}
							},
							error: function(err) {},
							complete: () => {
								uni.hideLoading();
							}
						});
					}
				});
			}

		}
	};
</script>
<style>
	.pay {
		position: relative;
		width: 750rpx;
		height: 100vh;
		background-color: #fff;
		overflow: hidden;
		margin: 0 auto;
	}

	.pay .pay_type {
		padding: 30rpx 30rpx 0;
	}

	.pay_type .title {
		line-height: 90rpx;
		color: #353535;
		font-size: 32rpx;
	}

	.pay_type .item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 130rpx;
		color: #181818;
		border-bottom: 1rpx solid #e8e8e8;
	}

	.pay_type .item:last-child {
		border: none;
	}

	.item .type_left {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.item .type_left .img {
		width: 52rpx;
		max-height: 70rpx;
		overflow: hidden;
		margin: 0 53rpx 0 10rpx;
	}

	.item image {
		width: 52rpx;
	}

	.goPay {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		height: 60px;
		width: 100%;
		width: 750rpx;
		z-index: 9;
	}

	.goPay button {
		background-color: #e74310;
		color: #fff;
		font-size: 17px;
		line-height: 60px;
		letter-spacing: 5px;
		border-radius: 0;
	}

	.dis {
		font-size: 26rpx;
		color: #b5b5b5;
	}

	.pay_type .disable {
		color: #989898;
	}

	.wrap {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 120rpx;
		width: 750rpx;
		height: calc(100vh -120rpx);
		z-index: -1;
		background-color: rgba(0, 0, 0, 0);
		transition: all 0.2s;
	}

	.wrap.on {
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}

	.wrap .popup {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 260rpx;
		width: 100%;
		background-color: #fff;
		transform: translateY(380rpx);
		transition: all 0.2s;
	}

	.wrap.on .popup {
		transform: translateY(0);
	}

	.popup .pw {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.pw view {
		display: block;
		color: #333;
		font-size: 30rpx;
		height: 80rpx;
		width: 160rpx;
		text-align: right;
		line-height: 80rpx;
		margin-right: 20rpx;
	}

	.pw input {
		width: 370rpx;
		height: 80rpx;
		border: 1rpx solid #e8e8e8;
		padding-left: 30rpx;
	}

	.popup .close {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 50rpx;
		height: 50rpx;
		overflow: hidden;
	}

	.popup .close image {
		width: 100%;
		height: 100%;
	}

	.pw-wrap {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	.pw-wrap .pw-modal {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 686rpx;
		height: 455rpx;
		border-radius: 20rpx;
		text-align: center;
		overflow: hidden;
		transform: translate(-50%, -80%);
		animation: fade 0.3s;
	}

	@keyframes fade {
		0% {
			transform: translate(-50%, -80%) scale3d(0.5, 0.5, 0.5);
			opacity: 0;
		}

		50% {
			-webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
			animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
		}

		100% {
			transform: translate(-50%, -80%) scale3d(1, 1, 1);
			-webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			opacity: 1;
		}
	}

	.pw-wrap .pw-modal .pw-title {
		position: relative;
		height: 99rpx;
		background-color: #ebebeb;
		font-size: 30rpx;
		font-weight: bold;
	}

	.pw-modal .pw-title text {
		line-height: 99rpx;
	}

	.pw-modal .pw-title .modal-close {
		position: absolute;
		top: 0;
		right: 0;
		padding: 30rpx;
	}

	.pw-modal .modal-close image {
		width: 30rpx;
		height: 30rpx;
	}

	.modal-main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		height: 356rpx;
		padding: 30rpx;
	}

	.modal-main input {
		width: 625rpx;
		height: 88rpx;
		border: 1rpx solid #dcdcdc;
		border-radius: 8rpx;
		margin-bottom: 30rpx;
	}

	.modal-main navigator {
		color: #0c8ae3;
		font-size: 26rpx;
		margin-bottom: 50rpx;
	}

	.modal-main button {
		width: 374rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		border-radius: 10rpx;
		background-color: #e00c1a;
	}
</style>
