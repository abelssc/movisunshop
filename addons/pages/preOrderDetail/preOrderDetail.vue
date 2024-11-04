<template>
	<view v-if="info">
		<view class="pay_success" v-if="info.order_state==20">
			<image :src="img_url+'addons/pay_success@2x.png'" mode="widthFix"></image>
		</view>

		<view class="pay_fail_txt" v-if="info.order_state==0">
			{{$L('支付超时，订单已失效')}}
		</view>

		<view class="address">
			<view class="addr_img">
				<image :src="img_url+'addons/address.png'" mode="widthFix"></image>
			</view>
			<view class="addr_info">
				<view>
					<text>{{info.address.true_name}}</text>
					<text>{{info.address.mob_phone}}</text>
				</view>
				<view>{{info.address.area_info+' '+info.address.address}}</view>
			</view>
		</view>

		<view class="goods">
			<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + info.vid" hover-class="none" class="store">
				<image :src="img_url+'addons/store.png'" mode="widthFix"></image>
				<text>{{info.store_name}}</text>
			</navigator>

			<navigator :url="'/pages/goods_detail/goods_detail?gid=' + info.gid" hover-class="none" class="goods_info">
				<view class="goods_logo">
					<image :src="info.goods_image" mode="widthFix"></image>
				</view>
				<view class="goods_name">
					<text class="name">{{info.goods_name}}</text>
					<view class="spec" v-if="info.goods_spec">
						<text v-for="(item, index) in info.goods_spec" :key="index">{{item}}</text>
					</view>
					<view class="send_str" v-if="info.send_str">{{info.send_str}}</view>
					<view class="y_pay" v-if="info.order_state==20">
						<image :src="img_url+'addons/pay@2x.png'" mode="widthFix"></image>
					</view>
				</view>
			</navigator>
		</view>

		<view class="ys_jd">
			<view class="jd_item">
				<view class="jd_title">{{$L('阶段一')}} {{info.state_1}}</view>
				<view class="jd_price">
					<text>{{info.state_str_1}}</text>
					<text>{{$L('￥')}}{{info.ding_price}}</text>
				</view>
			</view>

			<view class="jd_item" v-if="info.state_2">
				<view class="jd_title">{{$L('阶段二')}} {{info.state_2}}</view>
				<view class="jd_tip">{{info.state_str_2}}</view>
				<view class="jd_price">
					<text>{{$L('商品尾款')}}{{(info.order_state==20&&info.finish==0)?$L('(待支付)'):''}}</text>
					<text>{{$L('￥')}}{{info.wei_price}}</text>
				</view>
			</view>
		</view>

		<view :class="'order ' + ((info.finish||info.ding)?'pd':'')">
			<view class="order_item">{{$L('订单号：')}}{{info.order_sn}}</view>
			<view class="order_item">{{$L('订单时间：')}}{{info.add_time}}</view>
		</view>

		<view class="footer" v-if="info.finish||info.ding">
			<view class="f_lfet">{{info.ding?$L('应付定金：')+$L('￥')+info.ding_price:$L('应付尾款：')+$L('￥')+info.wei_price}}</view>
			<navigator :url="'/addons/pages/pay/pay?order_sn=' + info.order_sn + '&p=' + (info.ding?info.ding_price:info.wei_price) + '&type=presale'"
			 class="btn" hover-class="none">{{info.ding?$L('去支付定金'):$L('去支付尾款')}}</navigator>
		</view>

		<common :title="$L('订单详情')"></common>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				key: '',
				orderid: '',
				img_url: getApp().globalData.img_url, //图片地址
				info: {}
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('订单详情')
      });
			const key = uni.getStorageSync('token');

			if (!key) {
				getApp().globalData.goLogin();
			}

			this.setData({
				key,
				...options
			});
			this.getOrderDetail();
		},
		methods: {
			getOrderDetail() {
				let {
					orderid,
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=order&mod=order_desc&sld_addons=presale',
					data: {
						key,
						order_id: orderid
					},
					success: res => {
						if (res.data.status == 200) {
							this.setData({
								info: res.data.data
							});
						} else {
							uni.showModal({
								title: this.$L('提示'),
								content: res.msg,
								showCancel: false,
								confirmText:this.$L('确定'),
								success: e => {
									uni.navigateBack({});
								}
							});
						}
					}
				});
			},

			refresh() {
				this.getOrderDetail();
			}

		}
	};
</script>
<style>
	/* addons/pages/preOrderDetail/preOrderDetail.wxss */
	page {
		font-size: 28rpx;
		color: #666;
		background-color: #f6f6f6;
	}

	.pay_success {
		width: 750rpx;
	}

	.pay_success image {
		width: 100%;
	}

	.address {
		display: flex;
		align-items: center;
		height: 158rpx;
		padding: 0 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.address .addr_img {
		margin-right: 30rpx;
	}

	.addr_img image {
		width: 34rpx;
		height: 0;
	}

	.address .addr_info view:nth-child(1) {
		margin-bottom: 15rpx;
	}

	.addr_info view text {
		margin-right: 25rpx;
	}

	.goods {
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.goods .store {
		display: flex;
		height: 60rpx;
		align-items: center;
		padding: 0 20rpx;
		color: #353535;
		font-size: 24rpx;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.goods .store image {
		width: 24rpx;
		height: 0;
		margin-right: 20rpx;
	}

	.goods .goods_info {
		display: flex;
		padding: 30rpx;
	}

	.goods_info .goods_logo {
		flex: 0 0 220rpx;
		width: 220rpx;
		height: 220rpx;
		border: 1rpx solid #F0F0F0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.goods_info .goods_logo image {
		max-width: 100%;
		height: 0;
	}

	.goods_info .goods_name {
		position: relative;
		flex: 1;
		margin-left: 20rpx;
	}

	.goods_name .name {
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #353535;
		margin-bottom: 20rpx;
	}

	.goods_name .y_pay {
		position: absolute;
		top: 88rpx;
		right: 0;
	}

	.goods_name .y_pay image {
		width: 170rpx;
		height: 0;
	}

	.spec {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.spec text {
		display: inline-block;
		padding: 6rpx 10rpx;
	}

	.send_str {
		color: #FFB81E;
		font-size: 24rpx;
	}

	.ys_jd {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-top: 20rpx;
	}

	.ys_jd .jd_item:nth-child(1) {
		border-bottom: 1rpx solid #E8E8E8;
	}

	.ys_jd .jd_title {
		line-height: 30rpx;
		color: #FF0031;
		border-left: 4rpx solid #FF0031;
		margin: 20rpx 0;
		padding-left: 20rpx;
		font-size: 30rpx;
	}

	.ys_jd .jd_price {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #999;
	}

	.ys_jd .jd_price text:nth-child(2) {
		color: #FE011D;
		font-size: 30rpx;
	}

	.ys_jd .jd_tip {
		line-height: 60rpx;
		color: #FF0031;
		font-size: 24rpx;
		padding: 0 20rpx;
	}

	.order {
		background-color: #fff;
		line-height: 60rpx;
		color: #999999;
		font-size: 24rpx;
		padding: 0 20rpx;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 98rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 999;
	}

	.footer .btn {
		flex: 0 0 250rpx;
		background-color: #FE011D;
		height: 98rpx;
		text-align: center;
		line-height: 98rpx;
		color: #fff;
	}

	.footer .f_lfet {
		flex: 1;
		padding-left: 50rpx;
		color: #FE011D;
		font-size: 30rpx;
		font-weight: 600;
	}

	.pd {
		padding-bottom: 98rpx;
	}

	.pay_fail_txt {
		background-color: #FFF0BB;
		text-align: center;
		line-height: 70rpx;
		color: #7A6D3F;
		font-size: 24rpx;
	}
</style>
