<template>
	<view>
		<view class="tixian">
			<view class="tip">{{$L('温馨提示：提现手续费为')}}{{PaymentFee}}%</view>
			<view class="money br">
				<text>{{$L('可提现金额')}}</text>
				<text class="red">{{$L('￥')}}{{predepoit}}</text>
			</view>

			<view class="money br">
				<text>{{$L('本次提现')}}</text>
				<input type="number" v-model="tixian" :placeholder="$L('请输入提现金额')" placeholder-style="pl" @blur="inputHandle"></input>
			</view>
			<view class="fee">{{$L('本次提现手续费为')}}: <text>{{pdc_payment_fee}}{{$L('元')}}</text></view>
			<view class="zhanghao">{{$L('提现账号')}}</view>
			<view v-if="CashAccountList.length>0" class="money" data-url="/pages/tixian/chooseaccon" @tap="go">
				<text>{{chooseinfo?(chooseinfo.account_bank_name?chooseinfo.account_bank_name:chooseinfo.account_type_name):(CashAccountList[0].account_bank_name?CashAccountList[0].account_bank_name:CashAccountList[0].account_type_name)}}</text>
				<view class="more">
					<text>{{chooseinfo?chooseinfo.account_name:CashAccountList[0].account_name}}</text>
					<image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="money br" data-url="/pages/tixian/acconType" @tap="go">
				<text>{{$L('添加提现账号')}}</text>
				<image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
			</view>

			<button @tap="cashApply">{{$L('立即提现')}}</button>
		</view>
		<common :title="$L('我要提现')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				predepoit: 0,
				CashAccountList: [],
				id: -1,
				// indexs: 0,
				tixian: '',
				chooseinfo: '',
				low_limit: 0,
				// 最大提现金额
				PaymentFee: 0,
				//  提现手续费比例
				pdc_payment_fee: 0.00,
				//提现手续费
				account_type: '' // 支付类型,1为支付宝，2为银行卡，3为微信

			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('我要提现')
      });
			this.getCashAccountList(true);
			this.getFee();
			this.getMin();
		},

		onShow() {
			this.getMyAvailable();
			let id = this.id;
			let chooseinfo = this.chooseinfo;

			if (id > -1 && !chooseinfo) {
				this.getCashAccountList();
			}
		},

		methods: {
			go(e) {
				let url = e.currentTarget.dataset.url;

				if (url) {
					uni.navigateTo({
						url
					});
				}
			},

			// 获取手续费
			getFee() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=getCashoutPaymentFeePercentagean',
					success: res => {
						let PaymentFee = res.data.data.cashout_payment_fee_percentage;
						this.setData({
							PaymentFee: PaymentFee ? PaymentFee : 0
						});
					}
				});
			},

			// 获取最小提现金额
			getMin() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=getCashoutPaymentFeePercentagean',
					success: res => {
						let low_limit = res.data.data.cash_min_money_num;
						this.setData({
							low_limit: low_limit
						});
					}
				});
			},

			// 获取余额
			getMyAvailable() {
				let that = this,
					key = uni.getStorageSync('token');
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getMyAvailable&key=' + key,
					method: 'GET',

					success(res) {
						that.setData({
							predepoit: res.data.datas.predepoit
						});
					},

					error: function(err) {}
				});
			},

			// 获取充值账号
			getCashAccountList(cb) {
				let that = this,
					key = uni.getStorageSync('token');
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=cash&mod=getCashAccountList&key=' + key,
					method: 'GET',

					success(res) {
						if (res.data.state == 200) {
							that.setData({
								CashAccountList: res.data.data.list
							});

							if (cb) {
								that.setData({
									id: res.data.data.list[0].id,
									account_type: res.data.data.list[0].account_type
								});
							} else {
								that.setData({
									chooseinfo: res.data.data.list[0]
								});
							}
						}
					},

					error: function(err) {}
				});
			},

			// 选择账号
			choose(id) {
				let info = id;
				if (info.id) {
					this.setData({
						id: info.id,
						chooseinfo: info,
						account_type: info.account_type
					});
				} else {
					this.setData({
						id: id,
						chooseinfo: ''
					});
				}
			},

			// 提现金额
			inputHandle(e) {
				let that=this;
				let txs = e.detail.value;
				txs = txs.replace(/[^\.\d]/g, '');
				if (txs.indexOf(".") > 0 && txs.length - txs.indexOf(".") > 2 && txs != "") {
					txs=Math.floor(txs * 100) / 100;
				}
				let newNum = txs*1;
				let max = that.predepoit > that.low_limit ? Math.floor(that.predepoit) : that.low_limit; 
				if (txs > max) {
					newNum = max;
				}
				if (!txs) {
					newNum = '';
				}
				that.tixian = newNum;
				that.cancelFee(newNum);
			},

			cancelFee(num) {
				let {
					PaymentFee
				} = this;
				let fee = (Math.round(num > 0 ? num * PaymentFee : 0) / 100).toFixed(2);
				this.setData({
					pdc_payment_fee: fee
				});
			},

			// 提现
			cashApply() {
				let that = this,
					pdc_client = '',
					tixian = that.tixian,
					id = that.id,
					account_type = that.account_type,
					predepoit = that.predepoit,
					pdc_payment_fee = that.pdc_payment_fee,
					key = uni.getStorageSync('token');

				if (id < 0) {
					uni.showToast({
						title: that.$L('请选择提现账号'),
						icon: 'none'
					});
					return;
				}

				if (!tixian) {
					uni.showToast({
						title: that.$L('请输入提现金额'),
						icon: 'none'
					});
					return;
				}

				if (!/(^[1-9]\d*$)/.test(tixian)) {
					uni.showModal({
						title: that.$L('提示'),
						content: that.$L('请输入正确的金额'),
						confirmText:that.$L('确定'),
						showCancel: false
					});
					return;
				}

				if (Number(tixian) > Number(predepoit)) {
					uni.showModal({
						title: that.$L('提示'),
						content: that.$L('余额不足'),
						showCancel: false,
						confirmText:that.$L('确定'),
					});
					return;
				}

				//#ifdef MP-WEIXIN
				pdc_client = 'wx_xcx';
				//#endif
				
				//#ifdef APP-PLUS
				pdc_client = uni.getSystemInfoSync().platform;
				//#endif
				
				//#ifdef H5
				if(this.$isWeiXinBrower()){
					pdc_client = 'h5_weixin';
				}else{
					pdc_client = 'h5_brower';
				}
				//#endif
				if (id && tixian) {
					let requestUrl = getApp().globalData.ser_url + '/index.php?app=cash&mod=cashApply&key=' + key;
					let data = {
						pdc_amount: tixian,
						account_id: id,
						pdc_payment_fee: pdc_payment_fee,
						pdc_client: pdc_client,
					};
					let _this = this;
					if(that.account_type == 3){
						//微信提现
						//#ifdef H5
						 location.href = getApp().globalData.ser_url + "/index.php?app=cash&mod=cashApply&key=" + key + "&pdc_amount=" + tixian + "&account_id=" + id + "&pdc_payment_fee=" + pdc_payment_fee + "&pdc_client=" + pdc_client;
						//#endif
						//#ifdef MP-WEIXIN
						uni.login({
							success: obj => {
								data.code = obj.code;
								_this.txSubmit(requestUrl,data);
							}
						});
						//#endif
						//#ifdef APP-PLUS
						uni.login({
						  provider: 'weixin',
						  success: function (loginRes) {
							if(loginRes.errMsg == 'login:ok'){
								//授权登录成功
								data.wx_openid = loginRes.authResult.openid;
								_this.txSubmit(requestUrl,data);
							}
						  }
						});
						//#endif
					}else {
						//支付宝或银行卡
						this.txSubmit(requestUrl,data);
					}
				}
			},
			
			txSubmit(requestUrl,data){
				uni.showLoading({
					title:this.$L('加载中...'),
					duration:2000
				})
				uni.request({
					url: requestUrl,
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: function(res) {
						let da = res.data;
				
						if (da.state == 200) {
							uni.showModal({
								title: this.$L('提示'),
								content: da.msg,
								showCancel: false,
								confirmText:this.$L('确定'),
								success: function(res) {
									if (res.confirm) {
										uni.navigateBack();
										uni.hideLoading();
									}else{
										uni.hideLoading();
									}
								}
							});
						}
				
						if (da.state == 255) {
							uni.showModal({
								title: this.$L('提示'),
								content: da.msg,
								showCancel: false,
								confirmText:this.$L('确定'),
							});
						}
					}
				});
			}

		}
	};
</script>
<style>
	/* pages/tixian/tixian.wxss */
	page {
		width: 750rpx;
		margin: 0 auto;
	}

	.tixian {
		width: 750rpx;
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.money {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #555;
		background-color: #fff;
	}

	.money text:nth-child(1) {
		font-size: 32rpx;
		white-space: nowrap;
	}

	.br {
		border-top: 1rpx solid #eee;
	}

	.money image {
		width: 30rpx;
		height: 0;
	}

	.zhanghao {
		height: 80rpx;
		color: #959595;
		font-size: 28rpx;
		line-height: 80rpx;
		padding-left: 30rpx;
		background-color: #fff;
	}

	.money input {
		font-size: 30rpx;
		text-align: right;
		color: #000;
	}

	.pl {
		font-size: 26rpx;
		color: #999;
	}

	button {
		margin: 0 30rpx;
		font-size: 30rpx;
		color: #fff;
		line-height: 90rpx;
		margin-top: 50rpx;
		background-color: #ffb80f;
	}

	.money .more {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.red {
		color: #FC496D;
	}

	.tip {
		height: 60rpx;
		line-height: 60rpx;
		background-color: #FFE9E9;
		padding: 0 30rpx;
		color: #E0A2A2;
		font-size: 26rpx;
	}

	.fee {
		text-align: right;
		padding: 0 30rpx;
		font-size: 24rpx;
		line-height: 67rpx;
	}

	.fee text {
		color: #FC496D;
	}
</style>
