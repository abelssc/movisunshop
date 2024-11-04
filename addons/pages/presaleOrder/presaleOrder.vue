<template>
	<view>
		<view class="nav">
			<view v-for="(item, index) in navData" :key="index" :class="'nav_item ' + (active==item.type?'on':'')" :data-type="item.type"
			 @tap="changeNav">
				<text>{{item.name}}</text>
			</view>
		</view>

		<view class="list_wrap" v-if="orderList.length">
			<view v-for="(item, index) in orderList" :key="index" class="list">
				<navigator :url="'/pages/shopHomePage/shopHomePage?vid='+item.vid" hover-class="none" class="store">
					<view class="store_name">
						<image :src="img_url+'addons/store.png'" mode="widthFix"></image>
						<text>{{item.store_name}}</text>
					</view>
					<view class="order_state">{{item.order_state_str}}</view>
				</navigator>

				<navigator :url="'/addons/pages/preOrderDetail/preOrderDetail?orderid=' + item.order_id" hover-class="none" class="goods">
					<view class="goods_img">
						<image :src="item.goods_image" mode="widthFix"></image>
					</view>
					<view class="goods_info">
						<text class="goods_name">{{item.goods_name}}</text>
						<text class="price">x{{item.goods_num}}</text>
						<text class="price">{{$L('￥')}}{{item.goods_price}}</text>
					</view>
				</navigator>

				<view class="order_info">
					<text>{{$L('共')}}{{item.goods_num}}{{$L('件商品，定金已支付')}}{{$L('￥')}}{{item.ding_price}}</text>
					<text v-if="item.wei_price">{{$L('待支付尾款：')}}{{$L('￥')}}{{item.wei_price}} </text>
				</view>

				<view class="go_pay" v-if="item.ding==1">
					<navigator :url="'/addons/pages/pay/pay?order_sn=' + item.order_sn + '&p=' + item.ding_price + '&type=presale' + '&payFrom=orderList'"
					 hover-class="none" class="btn">{{$L('支付定金')}}</navigator>
				</view>

				<view class="go_pay" v-if="item.finish==1">
					<navigator :url="'/addons/pages/pay/pay?order_sn=' + item.order_sn + '&p=' + item.wei_price + '&type=presale' + '&payFrom=orderList'"
					 hover-class="none" class="btn">{{$L('支付尾款')}}</navigator>
				</view>
			</view>
		</view>
		<view class="ndata" v-else>
			<view class="ndata_wrap">
				<view class="img">
					<image :src="img_url+'order_w.png'" mode="widthFix"></image>
				</view>
				<text>{{$L('暂无数据')}}</text>
			</view>
		</view>

		<common :title="$L('预售订单')"></common>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				navData: [{
					name: this.$L('全部'),
					type: 'all'
				}, {
					name: this.$L('已付定金'),
					type: '1_20'
				}, {
					name: this.$L('待付尾款'),
					type: '1_30'
				}, {
					name: this.$L('支付超时'),
					type: '1_0'
				}],
				active: 'all',
				key: '',
				orderList: []
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('预售订单')
      });
			const key = uni.getStorageSync('token');

			if (!key) {
				getApp().globalData.goLogin();
			}

			this.setData({
				key
			});
			this.getOrderList();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getOrderList();
			}
		},

		methods: {
			getOrderList() {
				const {
					key,
					active,
					orderList
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=order&mod=pre_order_list&sld_addons=presale',
					data: {
						key,
						type: active == 'all' ? '' : active,
						page: 10,
						pn: this.pn
					},
					success: res => {
						if (res.data.status == 200) {
							let list = res.data.data.list;

							if (this.pn == 1) {
								this.setData({
									orderList: list
								});
							} else {
								this.setData({
									orderList: orderList.concat(list)
								});
							}

							if (res.data.data.ismore.hasmore) {
								this.pn++;
							} else {
								this.hasmore = false;
							}
						}
					}
				});
			},

			changeNav(e) {
				let type = e.currentTarget.dataset.type;
				this.setData({
					active: type
				});
				this.pn = 1;
				this.hasmore = true;
				this.getOrderList();
			},

			refresh() {
				this.pn = 1;
				this.hasmore = true;
				this.getOrderList();
			}

		}
	};
</script>
<style>
	/* addons/pages/presaleOrder/presaleOrder.wxss */

	page {
		/* #ifdef H5 */
		padding-top: 98rpx;
		/* #endif */
		background-color: #f6f6f6;
		width: 100%;
		margin: 0 auto;
	}

	.nav {
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: calc(44px + env(safe-area-inset-top));
		/* #endif */
		left: 0;
		right: 0;
		height: 98rpx;
		background-color: #ff0a52;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 750rpx;
		margin: 0 auto;
	}
	/* #ifdef H5 */
	.nav {
		/* top: 88rpx */
	}
	/* #endif */

	.nav_item {
		color: #fff;
		font-size: 28rpx;
	}

	.nav_item text {
		display: inline-block;
		border-bottom: 3rpx solid transparent;
		padding: 0 10rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 10rpx 0;

	}

	.nav_item.on text {
		border-bottom: 3rpx solid #fff;
	}

	.list_wrap {
		/* #ifdef H5 */
		padding: 0 20rpx 20rpx;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		padding: 100rpx 20rpx 20rpx;
		/* #endif */
	}

	.list_wrap .list {
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 0 5rpx #ccc;
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #353535;
	}

	.list .store {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		padding: 0 20rpx;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.list .store .store_name {
		display: flex;
		align-items: center;
	}

	.store_name image {
		width: 24rpx;
		height: 0;
		margin-right: 30rpx;
	}

	.store_state {
		color: #FF7713;
	}

	.goods {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.goods .goods_img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 220rpx;
		height: 220rpx;
		border: 1rpx solid #F0F0F0;
		overflow: hidden;
	}

	.goods .goods_img image {
		max-width: 220rpx;
		height: 0;
	}

	.goods .goods_info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 220rpx;
		margin-left: 20rpx;
	}

	.goods_info .goods_name {
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.goods_info .price {
		color: #666;
		font-size: 24rpx;
	}

	.order_info {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 20rpx;
		padding-bottom: 35rpx;
	}

	.order_info text:nth-child(1) {
		color: #999;
		margin-right: 10rpx;
	}

	.go_pay {
		display: flex;
		justify-content: flex-end;
		padding-right: 20rpx;
	}

	.go_pay .btn {
		width: 200rpx;
		height: 65rpx;
		background: -webkit-gradient(linear, 25% 100%, 75% 100%, from(#F9142E), to(#FF5968));
		text-align: center;
		line-height: 65rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 32rpx;
		margin-bottom: 35rpx;
	}

	.ndata {
		display: flex;
		height: calc(100vh - 98rpx);
		align-items: center;
		justify-content: center;
		color: #666;
		font-size: 26rpx;
	}

	.ndata_wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ndata .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 150rpx;
		height: 150rpx;
		background-color: #ddd;
		border-radius: 50%;
	}

	.ndata .img image {
		width: 100rpx;
		height: 100rpx;
	}

	.ndata text:nth-of-type(1) {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 0;
	}
</style>
