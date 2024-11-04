<template>
	<view>
		<view class="balance">
			<view class="balance_top">
				<image class="bg" :src="img_url+'bg.png'" mode="widthFix"></image>
				<view class="cz" @tap.stop="go">{{$L('提现')}}</view>
				<view class="right">
					<text>{{$L('我的余额')}}</text>
					<text>{{predepoit}}</text>
				</view>
			</view>

			<view class="balance_bottom">
				<scroll-view scroll-y v-if="CashApplyLogList.length>0 && CashApplyLogList != 'undefined'" @scrolltolower="getmore">
					<view v-for="(item, index) in CashApplyLogList" :key="index" class="item">
						<view class="item_left">
							<text>{{$L('申请单号：')}}{{item.pdc_sn}}</text>
							<text>{{$L('申请时间：')}}{{item.pdc_add_time_str}}</text>
							<text>{{$L('提现金额：')}}{{item.pdc_amount}}({{$L('手续费：')}}{{item.pdc_payment_fee}})</text>
							<text>{{$L('提现状态：')}}<text :class="(item.pdc_payment_state==0?'ye':'') + ' ' + (item.pdc_payment_state==1?'bl':'') + ' ' + (item.pdc_payment_state==-1?'red':'')">{{item.pdc_payment_state_desc}}</text></text>
						</view>
						<view class="item_right" :data-id="item.pdc_id" @tap="detail">
							<image src="/static/images/arrow_right_b.png"></image>
						</view>
					</view>
				</scroll-view>

				<view class="not" v-if="is_show_empty == true">
					<view class="img">
						<image :src="img_url+'search_w.png'"></image>
					</view>
					<text>{{$L('您还没有提现记录')}}</text>
				</view>
			</view>

		</view>

		<common :title="$L('提现')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				predepoit: 0,
				// 余额
				CashApplyLogList: [],
				img_url: getApp().globalData.img_url,
				is_show_empty: false //是否展示空页面
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		async onLoad(options) {
      uni.setNavigationBarTitle({
          title: this.$L('提现')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.currentPage = 1;
			this.hasmore = true;
			// this.setData({
			//   CashApplyLogList: []
			// });
			await this.getMyAvailable();
			await this.getCashApplyLogList();
		},

		onShow() {
      uni.setNavigationBarTitle({
        title: this.$L('提现')
      });
		},
		//触底
		onReachBottom() {
			this.getmore();
		},

		methods: {
			go() {
				uni.navigateTo({
					url: '/pages/tixian/tixian'
				});
			},

			// 获取余额
			getMyAvailable() {
				let that = this,
					key = that.key;
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

			// 获取提现列表
			getCashApplyLogList() {
				let that = this,
					key = that.key;
				uni.showLoading({
					title: that.$L('加载中...')
				});
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=cash&mod=getCashApplyLogList&key=' + key,
					method: 'GET',
					data: {
						pageSize: 10,
						currentPage: that.currentPage
					},

					success(res) {
						if (res.data.state == 200) {
							that.setData({
								CashApplyLogList: that.CashApplyLogList.concat(res.data.data.list)
							});

							if (that.CashApplyLogList.length < res.data.data.pagination.total) {
								that.currentPage++;
							} else {
								that.hasmore = false;
							}
						} else {
							that.setData({
								is_show_empty: true
							})
						}
					},

					error: function(err) {},
					complete: function() {
						uni.hideLoading();
					}
				});
			},

			getmore() {
				if (this.hasmore) {
					this.getCashApplyLogList();
				}
			},

			// 查看详情
			detail(e) {
				let id = e.currentTarget.dataset.id;

				if (id) {
					uni.navigateTo({
						url: '/pages/tixian/detail?id=' + id
					});
				}
			}

		}
	};
</script>
<style>
	/* pages/balance/balance.wxss */
	page {
		width: 750rpx;
		margin: 0 auto;
		background-color: #f5f5f5;
	}

	.balance {
		width: 750rpx;
		min-height: calc(100vh - 44px);
	}

	.balance .balance_top {
		position: fixed;
		width: 100%;
		height: 136rpx;
		overflow: hidden;
		z-index: 100;
	}

	.balance_top .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1;
	}

	.balance_top .bg image {
		width: 100%;
	}

	.balance_top .cz {
		position: absolute;
		top: 66rpx;
		left: 18rpx;
		padding: 0 10rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #c7900d;
		color: #fff;
		font-size: 28rpx;
		z-index: 3;
		text-align: center;
		border-radius: 8rpx;
	}

	.balance_top>view.right {
		position: relative;
		text-align: right;
		z-index: 2;
		color: #fff;
		padding-top: 20rpx;
		padding-right: 30rpx;
	}

	.balance_top>view text {
		display: block;
	}

	.balance_top>view text:nth-child(1) {
		font-size: 28rpx;
	}

	.balance_top>view text:nth-child(2) {
		font-size: 46rpx;
	}

	.balance .balance_bottom {
		padding: 166rpx 30rpx 30rpx;
	}

	.balance_bottom scroll-view {
		height: 100%;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		margin-bottom: 30rpx;
		padding: 30rpx;
		border-radius: 8rpx;
		color: #666;
		font-size: 28rpx;
	}

	.item .item_left text {
		display: block;
		margin-bottom: 10rpx;
	}

	.item .item_right {
		display: block;
		width: 40rpx;
		height: 40rpx;
		background-color: #d8d8d8;
		overflow: hidden;
		border-radius: 50%;
	}

	.item .item_right image {
		width: 20rpx;
		height: 20rpx;
		margin-left: 9rpx;
		margin-top: 1rpx;
	}

	.item:last-child {
		margin-bottom: 0;
	}

	.placeholder_style {
		color: #9f9f9f;
		font-size: 34rpx;
	}

	.not {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 200rpx;
	}

	.not .img {
		width: 140rpx;
		height: 140rpx;
		background-color: #ddd;
		border-radius: 50%;
		overflow: hidden;
	}

	.not .img image {
		width: 80rpx;
		height: 80rpx;
		margin-top: 31rpx;
		margin-left: 29rpx;
	}

	.not text {
		margin-top: 30rpx;
		font-size: 30rpx;
		color: #000;
	}

	.item .item_left .ye {
		display: inline;
		color: #f5a623;
	}

	.item .item_left .bl {
		display: inline;
		color: #62a315;
	}

	.item .item_left .red {
		display: inline;
		color: #fd5375;
	}
</style>
