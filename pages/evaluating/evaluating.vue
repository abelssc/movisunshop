<template>
	<view>
		<common :title="$L('订单评价')"></common>

		<view class="store">
			<view class="store-item">
				<text>{{$L('描述相符')}}</text>
				<Rate :score="store_desccredit" :disable="order_info.store_comment_status!=0" :store_type="'store_desccredit'"
				 @change="setScore"></Rate>
			</view>
			<view class="store-item">
				<text>{{$L('服务态度')}}</text>
				<Rate :score="store_servicecredit" :disable="order_info.store_comment_status!=0" store_type="store_servicecredit"
				 data-i="store_servicecredit" @change="setScore"></Rate>
			</view>
			<view class="store-item">
				<text>{{$L('发货速度')}}</text>
				<Rate :score="store_deliverycredit" :disable="order_info.store_comment_status!=0" store_type="store_deliverycredit"
				 data-i="store_deliverycredit" @change="setScore"></Rate>
			</view>
		</view>

		<button v-if="order_info.store_comment_status==0" @tap="submit" :class="'submit '">{{$L('提交评价')}}</button>

		<button v-if="order_info.store_comment_status!=0" @tap="submit_fanhui" :class="'submit ' + (order_info.store_comment_status==1?'dis':'')">{{$L('店铺已评价')}}</button>

		<view v-for="(item, index) in order_info.goods_list" :key="index" class="goods">
			<view class="img">
				<image :src="item.image_60_url" mode="aspectFit"></image>
			</view>
			<view class="info">
				<view class="name">{{item.goods_name}}</view>
				<navigator class="btn" :url="'/pages/evaluating/eval?order_id=' + item.order_id + '&gid=' + item.rec_id+'&index='+index"
				 hover-class="none" v-if="item.comment_status==0">{{$L('评价订单')}}</navigator>
				<view class="btn" v-if="item.comment_status==1">{{$L('订单已评价')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../utils/request";
	const app = getApp();
	import Rate from "../../component/Rate/Rate";

	export default {
		data() {
			return {
				key: '',
				order_id: '',
				order_info: '',
				store_desccredit: 0,
				store_servicecredit: 0,
				store_deliverycredit: 0,
				i: ""
			};
		},

		components: {
			Rate
		},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('订单评价')
      });
			var key = uni.getStorageSync('token');
			var order_id = options.id;

			if (key) {
				this.setData({
					key: key,
					order_id: order_id
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.initData();
		},
		methods: {
			initData() {
				let {
					order_id,
					key
				} = this;
				request({
					url: getApp().globalData.ser_url + `/index.php?app=userorder&mod=order_info&key=${key}&order_id=${order_id}`
				}).then(res => {
					if (res.datas.order_info) {
						let info = res.datas.order_info;
						let store_desccredit = 5,
							store_servicecredit = 5,
							store_deliverycredit = 5;

						if (info.store_comment_status == 1 && info.commentStoreInfo) {
							store_desccredit = info.commentStoreInfo.seval_desccredit;
							store_servicecredit = info.commentStoreInfo.seval_servicecredit;
							store_deliverycredit = info.commentStoreInfo.seval_deliverycredit;
						}

						this.setData({
							order_info: info,
							store_desccredit,
							store_servicecredit,
							store_deliverycredit
						});
					}
				});
			},

			setScore(e) {
				let i = e.storeType;
				let value = e.detail-1;
				this.setData({
					[i]: value
				});
			},
			submit_fanhui(){
				uni.navigateTo({
				  url: "/pages/order/order?s=nocomment"
				});
			},
			submit() {
				let {
					store_desccredit,
					store_servicecredit,
					store_deliverycredit,
					key,
					order_id
				} = this;
				request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=StoreComment',
					method: 'post',
					data: {
						key,
						order_id,
						store_desccredit,
						store_servicecredit,
						store_deliverycredit
					}
				}).then(res => {
					uni.showToast({
						title: res.datas.info,
						icon: 'none'
					});

					if (res.datas.state == 'success') {
						let page = getCurrentPages();
						if (page[page.length - 2].$vm.update) {
							page[page.length - 2].$vm.update()
						}
						if (page[page.length - 3].$vm.update) {
							page[page.length - 3].$vm.update()
						}
						this.setData({
							['order_info.store_comment_status']: 1
						});
						submit_fanhui();
					}
				});
			},

			update(id) {
				let {
					order_info
				} = this;
				let index = order_info.goods_list.findIndex(el => el.rec_id == id);
				order_info.goods_list[index].comment_status = 1;
				this.setData({
					order_info
				});
			}

		}
	};
</script>
<style>
	/* pages/evaluating/evaluating.wxss */

	page {
		background-color: #f5f5f5;
		width: 750rpx;
		margin: 0 auto;
	}

	.store {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;
		background-color: #fff;
	}

	.store .store-item {
		display: flex;
		align-items: center;
		height: 70rpx;
	}

	.store-item text {
		color: #232326;
		font-size: 28rpx;
		margin-right: 60rpx;
	}

	.submit {
		height: 80rpx;
		background-color: #f23030;
		font-size: 30rpx;
		border-radius: 10rpx;
		line-height: 80rpx;
		color: #fff;
		margin: 20rpx 30rpx;
	}

	.submit.dis {
		background-color: #B5B5B5;
	}

	.goods {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		background-color: #fff;
		padding: 20rpx;
	}

	.goods .img {
		flex: 0 0 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
	}

	.goods .img image {
		width: 120rpx;
		height: 120rpx;
	}

	.goods .info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 20rpx;
	}

	.goods .info .name {
		width: 100%;
		height: 84rpx;
		color: #232326;
		font-size: 28rpx;
		line-height: 42rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.goods .info .btn {
		align-self: flex-end;
		width: 190rpx;
		height: 60rpx;
		line-height: 58rpx;
		border-radius: 6rpx;
		border: 1rpx solid #bfbfbf;
		color: #686868;
		font-size: 26rpx;
		text-align: center;
	}
</style>
