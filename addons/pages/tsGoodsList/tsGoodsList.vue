<template>
	<view>
		<tsCommon></tsCommon>

		<scroll-view class="nav" scroll-x>
			<view :class="'nav_item ' + (active==''?'on':'')" data-id @tap="changeNav">
				<text>{{$L('全部')}}</text>
			</view>
			<view v-for="(item, index) in navData" :key="index" :class="'nav_item ' + (active==item.id?'on':'')" :data-id="item.id"
			 @tap="changeNav">
				<text>{{item.g_name}}</text>
			</view>
		</scroll-view>

		<view class="goodsList" v-if="goodsList.length">
			<view v-for="(item, index) in goodsList" :key="index" class="item">
				<navigator class="img" hover-class="none" :url="'/addons/pages/tsGoodsDetail/tsGoodsDetail?gid=' + item.gid + '&amount=' + item.yj_amount">
					<image :src="item.goods_image" mode="aspectFit"></image>
				</navigator>
				<view class="info">
					<navigator class="name" hover-class="none" :url="'/addons/pages/tsGoodsDetail/tsGoodsDetail?gid=' + item.gid + '&amount=' + item.yj_amount">{{item.goods_name}}</navigator>
					<view class="price">{{$L('￥')}}{{item.goods_price}}</view>
					<view class="share">
						<view class="amount">{{$L('奖励')}} <text>{{$L('￥')}}{{item.yj_amount}}</text> </view>
						<view class="share-wrap" :data-id="item.gid" @tap="share">
							<image :src="img_url+'addons/sld_share.png'"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="empty" v-if="!goodsList.length && !isLoading">
			<image :src="img_url+'no_goods_list.png'"></image>
			<text>{{$L('暂无商品')}}</text>
		</view>

		<common :title="$L('商品列表')"></common>

		<TsShare :show="show" :gid="shareGoods.gid" :goodsInfo="shareData" :goodsData="shareGoods" @close="cancelShare"></TsShare>
	</view>
</template>

<script>
	import TsShare from "../../../component/TsShare/TsShare";

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				navData: [],
				active: '',
				ssys_key: '',
				goodsList: [],
				shareData: {},
				shareGoods: {},
				isLoading: true,
				shareId: "",
				show: false,
				hasmore: true,
				pn: 1,
			};
		},

		components: {
			TsShare
		},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('商品列表')
      });
			const ssys_key = uni.getStorageSync('ssys_key');
			const shareId = uni.getStorageSync('ssys_share_code');
			this.setData({
				ssys_key: ssys_key,
				shareId: shareId
			});
			this.getCatesList();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getGoodsList();
			}
		},

		onShareAppMessage: function() {
			const {
				shareData
			} = this;
			this.setData({
				show: false
			});
			return shareData;
		},
		onShareTimeline: function() {
			const {
				shareData
			} = this;
			this.setData({
				show: false
			});
			return shareData;
		},
		methods: {
			getCatesList() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=ssys_goods&mod=cates_list&sld_addons=spreader',
					success: res => {
						if (res.data.code == 200) {
							let list = res.data.datas.types;
							this.setData({
								navData: list
							});
							this.getGoodsList();
						}
					}
				});
			},

			getGoodsList() {
				const {
					active,
					ssys_key
				} = this;

				if (this.pn === 1) {
					uni.showLoading({
						title: this.$L('加载中...')
					});
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=ssys_goods&mod=more_goods_list&sld_addons=spreader',
					data: {
						t: active,
						page: 10,
						pn: this.pn,
						ssys_key: ssys_key,
						shareId:this.shareId
					},
					success: res => {
						if (res.data.code == 200) {
							let list = res.data.datas.goods;

							if (this.pn == 1) {
								this.setData({
									goodsList: list
								});
							} else {
								let {
									goodsList
								} = this;
								this.setData({
									goodsList: goodsList.concat(list)
								});
							}

							if (res.data.hasmore) {
								this.pn++;
							} else {
								this.hasmore = false;
							}
						}
					},
					complete: () => {
						this.setData({
							isLoading: false
						});
						uni.hideLoading();
					}
				});
			},

			changeNav(e) {
				let id = e.currentTarget.dataset.id;
				this.pn = 1;
				this.hasmore = true;
				this.setData({
					active: id,
					goodsList: [],
					isLoading: true
				});
				this.getGoodsList();
			},

			share(e) {
				let id = e.currentTarget.dataset.id;
				const {
					goodsList,
					shareId
				} = this;
				let item = goodsList.filter(el => el.gid == id)[0];
				this.setData({
					show: true,
					shareData: {
						title: item.goods_name,
						path: '/pages/goods_detail/goods_detail?gid=' + item.gid + '&shareId=' + shareId,
						imageUrl: item.goods_image
					},
					shareGoods: item
				});
			},

			cancelShare() {
				this.setData({
					show: false,
					shareData: {},
					shareGoods: {}
				});
			}

		}
	};
</script>
<style>
	page {
		padding: 100rpx 0 0 0;
		background-color: #f6f6f6;
		width: 750rpx;
		margin: 0 auto;
	}

	.nav {
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: 90rpx;
		/* #endif */
		left: 0;
		right: 0;
		width: 750rpx;
		height: 98rpx;
		background-color: #fff;
		z-index: 99;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		border-bottom: 1rpx solid #EEEEEE;
		margin: 0 auto;
		/* #ifdef H5 */
		top: calc(var(--status-bar-height) + 88rpx);
		/* #endif */
	}

	.nav_item {
		display: inline-block;
		width: 20%;
		color: #353535;
		font-size: 28rpx;
		text-align: center;
		overflow: hidden;
	}

	.nav_item text {
		display: inline-block;
		line-height: 95rpx;
		border-bottom: 3rpx solid transparent;
		padding: 0 10rpx;
	}

	.nav_item.on text {
		color: #FC3357;
		border-bottom: 3rpx solid #FC3357;
	}

	.goodsList {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.goodsList .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: calc(375rpx - 2rpx);
		height: 435rpx;
		margin-bottom: 4rpx;
		padding-top: 30rpx;
		background-color: #fff;
	}

	.item .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 220rpx;
		height: 220rpx;
	}

	.item .img image {
		width: 100%;
		height: 100%;
	}

	.item .info {
		padding: 0 20rpx;
	}

	.info .name {
		width: 310rpx;
		color: #5C5C5C;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 36rpx;
		font-weight: 500;
		margin: 20rpx 0;
	}

	.info .price {
		color: #5C5C5C;
		font-size: 24rpx;
		margin: 20rpx 0;
	}

	.info .share {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.info .share .amount {
		color: #FC3357;
		font-size: 28rpx;
	}

	.info .share .amount text {
		font-size: 32rpx;
		margin-left: 35rpx;
	}


	.info .share .share-wrap {
		width: 50rpx;
		height: 50rpx;
		overflow: hidden;
		border-radius: 50%;
	}

	.info .share-wrap image {
		width: 100%;
		height: 100%;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: calc(100vh - 150rpx);
	}

	.empty image {
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 30rpx;
	}

	.empty text {
		color: #333;
		font-size: 28rpx;
	}

	.share-tip {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, .5);
		z-index: 998;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.share-tip .modal {
		width: 569rpx;
		height: 360rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding: 28rpx;
	}

	.share-tip .modal-goods {
		display: flex;
		align-items: center;
	}

	.share-tip .modal-goods .modal-goods-img {
		flex: 0 0 180rpx;
		width: 180rpx;
		height: 180rpx;
		margin-right: 15rpx;
	}

	.share-tip .modal-goods-img image {
		width: 100%;
		height: 100%;
	}

	.share-tip .modal-goods .modal-goods-info {
		flex: 1;
		height: 180rpx;
		color: #333333;
		font-size: 26rpx;
	}

	.share-tip .modal-goods .modal-price {
		margin-top: 26rpx;
		color: #FF1D1D;
	}

	.share-tip .modal-btn {
		margin-top: 64rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.share-tip .modal-btn button {
		width: 233rpx;
		height: 60rpx;
		border-radius: 30rpx;
		padding: 0;
		line-height: 58rpx;
		font-size: 26rpx;
	}

	.share-tip .modal-btn .cancel-btn {
		border: 1rpx solid #BFBFBF;
		color: #909090;
		background-color: #fff;
	}

	.share-tip .modal-btn .confirm-btn {
		border: 1rpx solid #FB3157;
		color: #fff;
		background-color: #FB3157;
	}
</style>
