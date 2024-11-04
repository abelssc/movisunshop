<template>
	<view>
		<view class="order" v-if="render_page_flag">
			<view class="addr" @tap="chooseAddr">
				<block v-if="info.address_info.true_name">
					<view>
						<text>{{info.address_info.true_name}}</text>
						<text>{{info.address_info.mob_phone}}</text>
					</view>
					<view>
						<text>{{info.address_info.area_info+''+info.address_info.address}}</text>
					</view>
				</block>
				<block v-else>
					<text class="not">{{$L('请添加地址')}}</text>
				</block>
			</view>

			<view class="order_list">
				<view v-for="(item, index) in info.store_cart_list" :key="index" class="item">
					<view class="img">
						<image :src="item.goods_image_url"></image>
					</view>
					<view class="info">
						<text>{{item.pgoods_name}}</text>
						<!-- <text>粉色</text> -->
						<text>{{$L('数量')}}</text>
					</view>
					<view class="info price">
						<text>{{item.pgoods_points}}{{$L('积分')}}</text>
						<text>X{{item.number}}</text>
					</view>
				</view>
			</view>

			<view class="order_info">
				<view class="wrap">
					<view class="first">
						<text>{{$L('商品合计')}}</text>
						<text>{{info.all_money}}{{$L('积分')}}</text>
					</view>
					<view class="first">
						<text>{{$L('运费')}}</text>
						<text>{{$L('免费')}}</text>
					</view>
				</view>

				<view class="last">
					<text>{{$L('合计应付')}}: {{info.all_money}}{{$L('积分')}}</text>
				</view>
			</view>

			<view class="footer">
				<view class="footer_info">
					{{$L('共')}}{{info.all_num}}{{$L('件 应付')}}:
					<text>{{info.all_money}}{{$L('积分')}}</text>
				</view>
				<view class="confirm" @tap="pay">{{$L('去兑换')}}</view>
			</view>
		</view>

		<common :title="$L('确认订单')"></common>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				key: '',
				ifcart: "",
				cart_id: "",
				info: "",
				render_page_flag: false,
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('确认订单')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			let ifcart = options.ifcart;
			let cart_id = options.cart_id;
			this.setData({
				ifcart,
				cart_id
			});
			this.confirmData();
		},
		onShow(){
			// this.confirmData();
		},
		methods: {
			// 确认订单信息
			confirmData() {
				let that = this,
					key = that.key,
					ifcart = that.ifcart,
					cart_id = that.cart_id;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_buy&mod=confirm&sld_addons=points',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key,
						ifcart,
						cart_id
					},
					success: function(res) {
						if (res.data.status == 200) {

							if (res.data.datas.address_info.length == 0) {
								uni.showModal({
									title: that.$L('温馨提示'),
									content: that.$L('请添加地址'),
									cancelText:that.$L('取消'),
									confirmText:that.$L('确定'),
									success: function(res) {
										if (res.confirm) {
											that.chooseAddr();
										} else {
											uni.navigateBack({});
										}
									}
								});
							}else{
								that.setData({
									info: res.data.datas,
									render_page_flag: true
								});
							}
						} else {
							uni.showModal({
								title: that.$L('温馨提示'),
								showCancel: false,
								content: res.data.msg,
								confirmText:that.$L('确定'),
								success: function() {
									uni.navigateBack({});
								}
							});
						}
					}
				});
			},

			// 付款
			pay() {
				let that = this,
					key = that.key,
					ifcart = that.ifcart,
					cart_id = that.cart_id,
					address_id = that.info.address_info.address_id;

				if (!address_id) {
					uni.showToast({
						title: that.$L('请选择收货地址'),
						icon: 'none'
					});
					return;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_buy&mod=submitorder&sld_addons=points',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key,
						ifcart,
						cart_id,
						address_id
					},
					success: function(res) {
						if (res.data.status == 200) {
							uni.showToast({
								title: res.data.msg
							});
							uni.reLaunch({
								url: '/integral/pages/my_order/my_order'
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/integral/pages/my_order/my_order?order=10'
								});
							}, 1500);
						}
					}
				});
			},

			// 选择地址
			chooseAddr() {
				uni.navigateTo({
					url: '/pages/address/address?form=1&isback=1'
				});
			},

			// 
			addr(data) {
				let newdata = data;
				this.setData({
					'info.address_info': newdata
				});
			}
		}
	};
</script>
<style>
	.order {
		min-height: calc(100vh - 140rpx);
		padding: 20rpx 0 120rpx;
		background-color: #f5f5f5;
		width: 750rpx;
		margin: 0 auto;
	}

	.addr {
		padding: 38rpx 30rpx;
		background-color: #fffcef;
		font-size: 28rpx;
		color: #565656;
		margin-bottom: 20rpx;
	}

	.addr view:nth-child(1) {
		font-size: 34rpx;
		color: #181818;
		margin-bottom: 10rpx;
	}

	.order_list {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-left: 30rpx;
	}

	.item {
		display: flex;
		justify-content: space-around;
		padding: 30rpx 30rpx 30rpx 0;
		border-bottom: 1rpx solid #dadada;
	}

	.item:last-child {
		border: none;
	}

	.item .img {
		flex: 0 0 140rpx;
		width: 140rpx;
		height: 140rpx;
		margin-right: 30rpx;
		border: 1rpx solid #f6f6f6;
	}

	.item .img image {
		width: 100%;
		height: 100%;
	}

	.item .info:nth-child(2) {
		flex: 1;
		padding-right: 30rpx;
	}

	.item .info:nth-child(2) text {
		width: 320rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.info text {
		display: block;
		color: #5e5e5e;
		font-size: 28rpx;
	}

	.info text:nth-child(1) {
		font-size: 32rpx;
		margin-bottom: 20rpx;
		color: #181818;
	}

	.price {
		text-align: right;
	}

	.price text:nth-child(1) {
		font-size: 28rpx;
		font-weight: 600;
	}

	.price text:nth-child(2) {
		color: #181818;
		font-size: 32rpx;
	}

	.order_info {
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}

	.order_info .wrap {
		padding: 30rpx 0;
	}

	.order_info .first {
		display: flex;
		justify-content: space-between;
		padding-bottom: 30rpx;
		color: #181818;
	}

	.order_info .first:last-child {
		padding-bottom: 0;
	}

	.order_info .last {
		height: 110rpx;
		line-height: 110rpx;
		border-top: 1rpx solid #e2e2e2;
		color: #c31c1c;
		text-align: right;
	}

	.footer {
		position: fixed;
		width: 750rpx;
		bottom: 0;
		/* width: 100%; */
		display: flex;
		height: 98rpx;
		border-top: 1rpx solid #cdcdcd;
		background-color: #fff;
		z-index: 9;
	}

	.footer_info {
		flex: 1;
		font-size: 32rpx;
		color: #181818;
		line-height: 98rpx;
		padding-left: 28rpx;
	}

	.footer_info text {
		color: #ec3737;
	}

	.confirm {
		flex: 0 0 240rpx;
		width: 240rpx;
		text-align: center;
		line-height: 98rpx;
		font-size: 36rpx;
		color: #fff;
		background-color: #ec3737;
	}

	.not {
		color: #666;
		font-size: 30rpx;
	}
</style>
