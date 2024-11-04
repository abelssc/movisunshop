<template>
	<view>
		<view class="favorites_top">
			<view class="favorites_nav">
				<text :class="type=='1'?'on':''" data-type="1" @tap="changeNav">{{$L('退款列表')}}</text>
				<text :class="type=='2'?'on':''" data-type="2" @tap="changeNav">{{$L('退货列表')}}</text>
			</view>
		</view>

		<view class="list" v-if="refundList.length">
			<view v-for="(item, index) in refundList" :key="index" class="item">
				<view class="store">
					<image src="/static/images/store_b.png" mode="widthFix"></image>
					{{item.store_name}}
				</view>

				<view class="goods-list">
					<view v-for="(child, index2) in item.order_goods" :key="index2" class="goods">
						<view class="img">
							<image :src="child.goods_image" mode="aspectFit"></image>
						</view>
						<view class="name">{{child.goods_name}}</view>
					</view>
				</view>

				<view class="order-info">
					<text class="time">{{item.add_time_wap}}</text>
					<view class="money">
						{{$L('退款金额：')}}<text>{{item.refund_amount}}</text>
					</view>
				</view>

				<view class="btns">
					<navigator :url="'/pages/refund/send?refund_id=' + item.refund_id" hover-class="none" v-if="type==2 && item.refund_type==2 && item.seller_state==2 && item.return_type==2 && item.goods_state==1">{{$L('发货')}}</navigator>
					<navigator :url="'/pages/refund/refund?id=' + item.refund_id+'&type='+type" v-if="type==1" hover-class="none">{{$L('退款详情')}}</navigator>
					<navigator :url="'/pages/refund/refund?id=' + item.refund_id+'&type='+type" v-else hover-class="none">{{$L('退货详情')}}</navigator>
				</view>
			</view>
		</view>

		<view class="no_cart_goods" v-if="!refundList.length && !isLoading">
			<view class="no_cart_goods_imgBox">
				<image :src="img_url + 'order_w.png'"></image>
			</view>

			<text class="no_cart_goods_text1">{{$L('您还没有')}}{{type==1?$L('退款'):$L('退货')}}{{$L('消息')}}</text>
			<text class="no_cart_goods_text2">{{$L('已购订单可申请')}}{{type==1?$L('退款'):$L('退货')}}</text>
		</view>

		<common :title="$L('退款退货')"></common>
	</view>
</template>

<script>
	import request from "../../utils/request";

	export default {
		data() {
			return {
				show_url: '',
				type: 1,
				// 1、退款  2、退货
				refundList: [],
				isLoading: true,
				img_url: getApp().globalData.img_url, //图片地址
				key: "",
				pn: 1,
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
        title: this.$L('退款退货')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			if (options.type) {
				this.setData({
					type: options.type
				});
			}

			this.initData();
		},
		methods: {
			initData() {
				let {
					type,
					key
				} = this;
				let url = type == 1 ? getApp().globalData.ser_url +
					`/index.php?app=userorder&mod=refundList&key=${key}&pn=${this.pn}&page=10` : getApp().globalData.ser_url +
					`/index.php?app=userorder&mod=returnList&key=${key}&pn=${this.pn}&page=10`;
				request({
					url
				}).then(res => {
					if (res.code == 200) {
						let list = res.datas.refund_list;

						if (this.pn == 1) {
							this.setData({
								refundList: list
							});
						} else {
							let {
								refundList
							} = this;
							this.setData({
								refundList: refundList.concat(list)
							});
						}
					}

					if (this.pn == 1) {
						this.setData({
							isLoading: false
						});
					}
				}).then(err => {
					if (this.pn == 1) {
						this.setData({
							isLoading: false
						});
					}
				});
			},

			changeNav(e) {
				let newType = e.currentTarget.dataset.type;
				let {
					type
				} = this;
				if (newType == type) return;
				this.setData({
					type: newType
				});
				this.pn = 1;
				this.hasmore = true;
				this.initData();
			},

			updata(id) {
				let {
					refundList
				} = this;
				let index = refundList.findIndex(el => el.refund_id == id);
				refundList[index].return_type = 1;
				this.setData({
					refundList
				});
			}

		}
	};
</script>
<style>
	/* pages/refund/list.wxss */
	page {
		background-color: #f5f5f5;
		width: 750rpx;
		margin: 0 auto;
	}

	.favorites_top {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 750rpx;
		height: 84rpx;
		background-color: #fff;
	}
	/* #ifdef H5 */
	.favorites_top {
		top: 88rpx;
	}
	/* #endif */

	.favorites_top .favorites_nav {
		display: flex;
		width: 480rpx;
		justify-content: center;
		align-items: center;
		margin: 10rpx auto;
		border: 2rpx solid #f23030;
		border-radius: 15rpx;
		overflow: hidden;
	}

	.favorites_nav text {
		width: 240rpx;
		color: #333;
		font-size: 32rpx;
		line-height: 64rpx;
		text-align: center;
	}

	.favorites_nav text.on {
		background-color: #f23030;
		color: #fff;
	}

	.list {
		padding-top: 90rpx;
	}

	.item {
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.item .store {
		display: flex;
		height: 90rpx;
		align-items: center;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #252525;
	}

	.item .store image {
		width: 20rpx;
		height: 0;
		margin-right: 20rpx;
	}

	.item .goods-list {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* height: 128rpx; */
		padding: 30rpx 20rpx;
		background-color: #f5f5f5;
	}

	.goods-list .goods {
		display: flex;
		width:100%;
		margin-top:20rpx;
	}

	.goods-list .goods .img {
		width: 128rpx;
		height: 128rpx;
	}

	.goods .img image {
		width: 128rpx;
		height: 128rpx;
	}

	.goods .name {
		padding: 30rpx 0;
		color: #333;
		font-size: 26rpx;
		margin-left: 20rpx;
	}

	.order-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		padding: 0 20rpx;
		border-bottom: 1rpx solid #e3e5e9;
	}

	.order-info .time {
		color: #6d6d6d;
		font-size: 24rpx;
	}

	.order-info .money {
		color: #000;
		font-size: 28rpx;
	}

	.order-info .money text {
		color: #f23030;
	}

	.btns {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100rpx;
		padding: 0 30rpx;
	}

	.btns navigator {
		display: block;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
		border: 1rpx solid #bfbfbf;
		color: #686868;
		font-size: 26rpx;
		border-radius: 8rpx;
		margin-left: 30rpx;
	}


	.no_cart_goods {
		position: absolute;
		top: 50%;
		margin-top: -190rpx;
		align-items: center;
		left: 50%;
		margin-left: -144rpx;
		display: flex;
		flex-direction: column;
	}

	.no_cart_goods_imgBox {
		width: 170rpx;
		height: 170rpx;
		background-color: #DDD;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.no_cart_goods image {
		width: 100rpx;
		height: 100rpx;
		display: block;
		text-align: center;
		margin: 0 auto;
	}

	.no_cart_goods_text1 {
		color: #000;
		font-size: 32rpx;
		margin-top: 26rpx;
	}

	.no_cart_goods_text2 {
		color: #999;
		font-size: 28rpx;
	}
</style>
