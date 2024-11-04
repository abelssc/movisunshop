<template>
	<view class="content">
		<view v-for="(item, index) in list" :key="index" class="goods-item goods-small">
			<view class="navigator">
				<view class="goods-item-pic">
					<navigator :url="'../goods_detail/goods_detail?gid=' + item.pgid">
						<image :src="item.pgoods_image" alt></image>
					</navigator>
				</view>
				<view class="goods-item-name">{{item.pgoods_name}}</view>
				<view class="goods-item-price d2">
					<text class="bigprice">{{item.pgoods_points}}{{$L('积分')}}</text>
					<text class="bigprice2">{{$L('售价：')}}{{$L('￥')}}{{item.pgoods_price}}</text>
				</view>
				<view class="tbuy">
					<view :data-id="item.pgid" @tap="cart">
						<image :src="img_url+'integral/cart.png'" mode="widthFix"></image>
					</view>
					<view :data-id="item.pgid" @tap="buy">
						{{$L('立即兑换')}}
					</view>
				</view>
			</view>
		</view>
		<!-- 底部站位栏 -->
		<view class="iphone_view" :style="'height:'+bottomSateArea"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				key: "",
				img_url: getApp().globalData.img_url,
				hasmore: true,
				pn: 1,
				bottomSateArea: getApp().globalData.bottomSateArea, //iphone手机底部一条黑线的高度
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('全部礼品')
      });
			this.getcommend();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getcommend();
			}
		},

		methods: {
			getcommend() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=point_list&sld_addons=points',
					data: {
						page: 10,
						pn: this.pn
					},
					success: res => {
						if (res.data.state == 200) {
							let data = res.data.data.list;

							if (this.pn == 1) {
								this.setData({
									list: data
								});
							} else {
								let {
									list
								} = this;
								this.setData({
									list: list.concat(data)
								});
							}
						}

						if (res.data.hasmore) {
							this.pn++;
						} else {
							this.hasmore = false;
						}
					}
				});
			},

			checkLogin(cb) {
				let key = uni.getStorageSync('token');

				if (key) {
					this.setData({
						key
					});
					cb && cb(key);
				} else {
					getApp().globalData.goLogin();
				}
			},

			// 单件购买
			buy(e) {
				let that = this,
					gid = e.currentTarget.dataset.id;
				that.checkLogin(function(key) {
					uni.navigateTo({
						url: '/integral/pages/Integral_order/Integral_order?ifcart=0&cart_id=' + gid + '|1'
					});
				});
			},

			//加入购物车
			cart(e) {
				let that = this,
					gid = e.currentTarget.dataset.id;
				that.checkLogin(function(key) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=addcart&sld_addons=points',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							num: 1,
							gid
						},
						success: function(res) {
							if (res.data.status == 200) {
								uni.showToast({
									title: that.$L('加入购物车成功'),
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				});
			}

		}
	};
</script>

<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
	@-webkit-keyframes myfirst {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@-webkit-keyframes endshow {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	}

	@-webkit-keyframes infirst {
		from {
			opacity: 0.6;
		}

		to {
			opacity: 1;
		}
	}

	@-webkit-keyframes endfirst {
		from {
			background: rgba(255, 255, 255, 1);
		}

		to {
			background: rgba(255, 255, 255, 0.6);
		}
	}

	input.htsearch-input::-webkit-input-placeholder {
		color: #000;
	}

	.bgshow_top {
		animation: myfirst 1s;
		-moz-animation: myfirst 1s;
		/* Firefox */
		-webkit-animation: myfirst 1s;
		/* Safari 和 Chrome */
		-o-animation: myfirst 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.bghide_top {
		animation: endshow 1s;
		-moz-animation: endshow 1s;
		/* Firefox */
		-webkit-animation: endshow 1s;
		/* Safari 和 Chrome */
		-o-animation: endshow 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.inputtm_top {
		animation: infirst 1s;
		-moz-animation: infirst 1s;
		/* Firefox */
		-webkit-animation: infirst 1s;
		/* Safari 和 Chrome */
		-o-animation: infirst 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.inputntm_top {
		animation: endfirst 1s;
		-moz-animation: endfirst 1s;
		/* Firefox */
		-webkit-animation: endfirst 1s;
		/* Safari 和 Chrome */
		-o-animation: endfirst 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}


	/*商品组合样式  */

	.goods {
		border: none;
		background: #fff;
		margin-top: 0;
	}

	.index_block {
		width: 750rpx;
		clear: both;
		overflow: hidden;
		background: #fff;
		display: block;
	}

	.goods .content {
		background: #f0f2f5;
		clear: both;
		overflow: hidden;
		display: block;
	}

	.goods .goods-small.goods-item:nth-child(2n) {
		margin-right: 10rpx;
	}

	.goods-small.goods-item {
		overflow: hidden;
		float: left;
		width: 360rpx;
		box-sizing: border-box;
		margin-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		background-color: #fff;
		margin-left: 10rpx;
	}

	.goods-item .navigator {
		display: block;
		background: #fff;
	}

	.goods-item-pic {
		vertical-align: middle;
		line-height: 0;
		display: table-cell;
		text-align: center;
		width: 370rpx;
		height: 370rpx;
	}

	.goods-item-pic image {
		width: 367rpx;
		height: 367rpx;
	}

	.goods-small .goods-item-name {
		height: 66rpx;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		color: #232326;
		margin-top: 10rpx;
		line-height: 33rpx;
		padding: 0 20rpx;
	}

	.goods-item-price {
		color: #f23030;
		display: inline-block;
		padding: 0 10rpx 0 8rpx;
		position: relative;
		top: 2rpx;
		height: 50rpx;
		line-height: 50rpx;
		margin-bottom: 20rpx;
	}

	.goods-item-price .yens {
		font-size: 26rpx;
	}

	.goods-item-price .bigprice {
		font-size: 26rpx;
	}

	.goods-big.goods-item {
		overflow: hidden;
		float: left;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding: 16rpx 16rpx 0;
	}

	.goods-item-name {
		height: 66rpx;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		color: #232326;
		margin-top: 10rpx;
		line-height: 34rpx;
		padding: 0 8rpx;
	}

	.goods-big .goods-item-price {
		color: #f23030;
		display: inline-block;
		padding: 0 10rpx 0 8rpx;
		position: relative;
		top: 2rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.goods-big .goods-item-pic image {
		width: 734rpx;
		height: 734rpx;
		padding: 0 8rpx;
	}

	.hide_title .goods-item .goods-item-name {
		display: none !important;
	}

	.hide_price .goods-item .goods-item-price {
		display: none !important;
	}

	.goods-list.goods-item .goods-item-pic {
		float: left;
		width: 214rpx !important;
		height: 214rpx !important;
	}

	.goods-list.goods-item {
		overflow: hidden;
		float: left;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		background: #fff;
		margin-bottom: 16rpx;
	}

	.goods-list.goods-item .goods-item-pic image {
		width: 214rpx !important;
		height: 214rpx !important;
	}

	.goods-list .goods-item-name {
		padding-top: 40rpx;
	}

	.d2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
	}

	.d2 .bigprice2 {
		color: #726F6F;
		font-size: 20rpx;
	}

	.tbuy {
		display: flex;
		align-items: center;
		width: 338rpx;
		height: 48rpx;
		border-radius: 25rpx;
		text-align: center;
		border: 1rpx solid #EE2328;
		margin: 0 auto 12rpx;
		overflow: hidden;
	}

	.tbuy>view {
		flex: 1;
	}

	.tbuy image {
		width: 30rpx;
	}

	.tbuy view:last-child {
		height: 100%;
		background-color: #EE2328;
		color: #fff;
		font-size: 24rpx;
		line-height: 48rpx;
	}
	.iphone_view{
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
		float: left;
	}
</style>
