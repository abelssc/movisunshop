<template>
	<view>
		<view class="order_detail" v-if="order_info">
			<view class="bbctouch-order-list" id="order-info-container">
				<view class="bbctouch-oredr-detail-block">
					<view class="order_det_num">{{$L('订单号：')}}{{order_info.order_sn}}</view>
					<view class="order-state">{{order_info.state_desc}}</view>
				</view>
				<view class="bbctouch-oredr-detail-block">
					<view class="bbctouch-oredr-detail-add">
						<i class="icon-add">
							<image style="width:60%;height:60%;" :src="img_url+'location_b.png'"></image>
						</i>
						<dl class="md-addr" v-if="order_info.ziti==1 && order_info.dian_id>0">
							<dd>{{$L('自提门店：')}}{{order_info.dian.dian_name}} {{order_info.dian.dian_phone[1]}}</dd>
							<dd>{{$L('门店地址：')}}{{order_info.dian.dian_address}}</dd>
							<dd v-if="order_info.order_state != 10">{{$L('核销码：')}}{{order_info.hexiao_code}}</dd>
						</dl>
						<dl v-else>
							<dt>{{$L('收货人：')}}
								<span>{{order_info.reciver_name}}</span>
								<span>{{order_info.reciver_phone}}</span>
							</dt>
							<dd>{{$L('收货地址：')}}{{order_info.reciver_addr}}</dd>
						</dl>

						<view class="navigate" @tap="showCz" v-if="order_info.ziti==1 && order_info.dian_id>0">
							<image :src="img_url+'navigate.png'" mode="aspectFit"></image>
						</view>
					</view>
				</view>
				<view class="bbctouch-order-item">
					<view class="bbctouch-order-item-head" :data-store-id="order_info.vid" @tap.stop="go_vendor">
						<image src="/static/images/store_b.png" mode="widthFix"></image>
						<text>{{order_info.store_name}}</text>
						<image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
					</view>
					<view class="bbctouch-order-item-con">
						<view v-for="(item, index) in order_info.goods_list" :key="index" class="goods-block detail">
							<a :data-goods-id="item.gid" href="javascript:void(0)" @tap.stop="go_goods_detail">
								<view class="goods-pic">
									<view class="goods-pic-middle">
										<image :src="item.image_url"></image>
									</view>
								</view>
								<dl class="goods-info">
									<dt class="goods-name">{{item.goods_name}}</dt>
									<dt class="goods-type" v-if="item.goods_type_cn!=''">{{item.goods_type_cn}}</dt>
								</dl>
								<view class="goods-subtotal">
									<span class="goods-price">{{$L('￥')}}
										<em>{{item.goods_price}}</em>
									</span>
									<span class="goods-num">x{{item.goods_num}}</span>
									<view class="refund">
										<view class="re_btn" :data-order-id="item.order_id" :data-gid="item.rec_id" data-type="refund" @tap.stop="refund"
										 v-if="item.refund==1&&item.goods_type!=5||item.refund==3&&item.goods_type!=5">{{$L('退款')}}</view>
										<view class="re_btn" :data-order-id="item.order_id" :data-gid="item.rec_id" data-type="return" @tap.stop="sales_return"
										 v-if="item.refund==1&&item.goods_type!=5">{{$L('退货')}}</view>
										<view class="re_btn" v-if="order_info.order_state > 20&&item.refund == 0">{{$L('退款退货中···')}}</view>
									</view>
								</view>
							</a>
						</view>

						<view class="goods-subtotle">
							<view :hidden="order_info.promotion.length>0?false:true">
								<dl>
									<dt>{{$L('优惠')}}</dt>
									<dd v-for="(item, index) in order_info.promotion" :key="index">
										<span>{{item['1']}}</span>
									</dd>
								</dl>
							</view>
							<dl v-if="order_info.red_money">
								<dt class="grade_discount">{{$L('平台优惠券')}}</dt>
								<dd>{{$L('￥')}}
									<em>{{order_info.red_money}}</em>
								</dd>
							</dl>
							
							<dl v-if="order_info.vred_money">
								<dt class="grade_discount">{{$L('店铺优惠券')}}</dt>
								<dd>{{$L('￥')}}
									<em>{{order_info.vred_money}}</em>
								</dd>
							</dl>
							<dl v-if="order_info.extend_order_common.grade_discount">
								<dt class="grade_discount">{{$L('商品总价')}}
									<view>
										<image :src="img_url+'V2@2x.png'"></image> <text>{{$L('会员')}}{{order_info.extend_order_common.grade_discount}}{{$L('折')}}</text>
									</view>
								</dt>
								<dd>{{$L('￥')}}
									<em>{{order_info.order_amount}}</em>
								</dd>
							</dl>
							<dl>
								<dt>{{$L('运费')}}</dt>
								<dd>{{$L('￥')}}
									<em>{{order_info.shipping_fee}}</em>
								</dd>
							</dl>
							<dl class="t">
								<dt>{{$L('实付款（含运费）')}}</dt>
								<dd>{{$L('￥')}}
									<em>{{order_info.order_amount}}</em>
								</dd>
							</dl>
						</view>
					</view>
				</view>
				<view v-if="order_info.order_message" class="bbctouch-oredr-detail-block">
					<view class="beizhu">
						<i class="msg">
							<image style="width: 60%;height: 60%;" src="/static/images/mcc_04.png"></image>
						</i>{{$L('买家留言')}}
					</view>
					<view class="info">{{order_info.order_message}}</view>
				</view>

				<view v-if="order_info.invoice" class="bbctouch-oredr-detail-block">
					<view class="beizhu">
						<i class="invoice">
							<image style="width: 60%;height: 60%;" :src="img_url+'mcc_08_b.png'"></image>
						</i>{{$L('发票信息')}}
					</view>
					<view class="info">{{order_info.invoice}}</view>
				</view>

				<view :hidden="order_info.payment_name?false:true" class="bbctouch-oredr-detail-block">
					<view class="beizhu">
						<i class="pay">
							<image style="width: 60%;height: 60%;" :src="img_url+'mcc_06_b.png'"></image>
						</i>{{$L('付款方式')}}</view>
					<view class="info">{{order_info.payment_name}}</view>
				</view>
				<view class="bbctouch-oredr-detail-block">
					<view class="order-log">
						<view>{{$L('创建时间：')}}{{order_info.add_time}}</view>
						<view :hidden="order_info.payment_time?false:true">{{$L('付款时间：')}}{{order_info.payment_time}}</view>
						<view :hidden="order_info.shipping_time?false:true">{{$L('发货时间：')}}{{order_info.shipping_time}}</view>
						<view :hidden="order_info.finnshed_time?false:true">{{$L('完成时间：')}}{{order_info.finnshed_time}}</view>
					</view>
				</view>

				<view class="botton_btn">
					<view class="btn" :data-order-id="order_info.order_id" @tap="pinjia" v-if="order_info.if_evaluation">{{$L('评价订单')}}</view>
					<view class="btn" :data-order-id="order_info.order_id" @tap="confirm_order" v-if="order_info.if_receive">{{$L('确认收货')}}</view>
					<view class="btn" :data-order-id="order_info.order_id" @tap="show_wuliu" v-if="order_info.if_deliver">{{$L('查看物流')}}</view>
					<view class="btn" :data-order-id="order_info.order_id" @tap="refund" v-if="order_info.if_refund_cancel">{{$L('订单退款')}}</view>
					<view class="btn" :data-order-id="order_info.order_id" @tap="cancle_order" v-if="order_info.if_buyer_cancel">{{$L('取消订单')}}</view>
					<view class="btn" :data-order-id="order_info.order_id" @tap="del_order" v-if="order_info.if_delete">{{$L('删除订单')}}</view>
					<view class="btn" :data-order-id="order_info.order_id" @tap="tuik" v-if="order_info.if_lock">{{$L('退款/退货中...')}}</view>
				</view>
			</view>
		</view>

		<common :title="$L('订单详情')"></common>
	</view>
</template>

<script>
	import {
		confirm_order,
		cancle_order,
		del_order
	} from "../../utils/order";

	export default {
		data() {
			return {
				order_info: '',
				img_url: getApp().globalData.img_url, //图片地址
				key: "",
				order_id: ""
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('订单详情')
      });
			// 	生命周期函数--监听页面加载
			//获取token  如果没有跳转登录注册页 否则进入个人中心
			var key = uni.getStorageSync('token');

			if (key) {
				//将可以存到data里
				this.setData({
					key: key,
					order_id: options.order_id
				});
			} else {
				getApp().globalData.goLogin();
			} //根据订单号获取订单详情


			this.getOrderDetail();
		},
		methods: {
			//更新详情
			update() {
				this.getOrderDetail()
			},

			// 获取订单详情
			getOrderDetail() {
				uni.showLoading({
					title: this.$L('正在请求...')
				});
				var that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_info_xcx',
					data: {
						key: that.key,
						order_id: that.order_id
					},
					dataType: 'json',
					success: function(result) {
						that.setData({
							order_info: result.data.datas.order_info
						});
						if(result.data.datas.error){
							uni.showToast({
							  title: result.data.datas.error,
							  icon: 'none'
							});
						}
					},

					complete() {
						uni.hideLoading();
					}

				});
			},

			//进入店铺事件
			go_vendor: function(e) {
				let vid = e.currentTarget.dataset.storeId
				if (getCurrentPages().length > 8) {
					uni.redirectTo({
						url: '../shopHomePage/shopHomePage?vid=' + vid
					});
				} else {
					uni.navigateTo({
						url: '../shopHomePage/shopHomePage?vid=' + vid
					});
				}
			},
			//进入商品详情页事件
			go_goods_detail: function(e) {
				if (getCurrentPages().length > 8) {
					uni.redirectTo({
						url: '../goods_detail/goods_detail?gid=' + e.currentTarget.dataset.goodsId
					});
				} else {
					uni.navigateTo({
						url: '../goods_detail/goods_detail?gid=' + e.currentTarget.dataset.goodsId
					});
				}
			},

			// 退款
			refund(e) {
				let orderid = e.currentTarget.dataset.orderId;
				let gid = e.currentTarget.dataset.gid;
				let type = e.currentTarget.dataset.type;
				type = type ? type : 1;
				uni.navigateTo({
					url: '/pages/refund/detail?orderid=' + orderid + '&gid=' + gid + '&type=' + type
				});
			},

			// 退货
			sales_return(e) {
				let orderid = e.currentTarget.dataset.orderId;
				let gid = e.currentTarget.dataset.gid;
				let type = e.currentTarget.dataset.type;
				type = type ? type : 1;
				uni.navigateTo({
					url: '/pages/sales_return/detail?orderid=' + orderid + '&gid=' + gid + '&type=' + type
				});
			},

			//确认收货
			confirm_order(e) {
				let that = this;
				confirm_order(e, that, function() {
					that.getOrderDetail();
				});
			},

			// 取消订单
			cancle_order(e) {
				let that = this;
				cancle_order(e, that, function() {
					that.getOrderDetail();
				});
			},

			// 查看物流
			show_wuliu: function(e) {
				var orderid = e.currentTarget.dataset.orderId;
				uni.navigateTo({
					url: '../order/wuliu?u=' + orderid
				});
			},

			// 删除订单
			del_order(e) {
				let that = this;
				del_order(e, that, function() {
					//that.getOrderDetail();
					uni.redirectTo({
						url: '/pages/order/order'
					})
				});
			},

			// 评价订单
			pinjia(e) {
				var orderid = e.currentTarget.dataset.orderId;
				uni.navigateTo({
					url: '/pages/evaluating/evaluating?id=' + orderid
				});
			},

			tuik() {
				uni.navigateTo({
					url: '/pages/refund/list'
				});
			},

			showCz() {
				let {
					dian
				} = this.order_info;
				uni.showModal({
					title: this.$L('提示'),
					content: this.$L('您需要什么操作'),
					cancelText: this.$L('导航'),
					confirmText: this.$L('拨号'),
					cancelColor: '#333',
					confirmColor: '#40AFFE',
					success: res => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: dian.dian_phone[0]
							});
						} else {
							uni.openLocation({
								latitude: dian.dian_lat * 1,
								longitude: dian.dian_lng * 1,
								name: dian.dian_name,
								address: dian.dian_address
							});
						}
					}
				});
			}

		}
	};
</script>
<style>
	page {
		background-color: #f0f2f5;
		width: 750rpx;
		margin: 0 auto;
	}

	.order_detail {
		border-top: 1rpx solid #e3e5e9;
	}

	.bbctouch-oredr-detail-block {
		position: relative;
		z-index: 1;
		display: block;
		padding: 18rpx 0;
		background: #fff;
		clear: both;
		overflow: hidden;
	}

	.bbctouch-oredr-detail-block .order_det_num {
		display: inline-block;
		vertical-align: top;
		height: 46rpx;
		margin-left: 18rpx;
		font-size: 28rpx;
		line-height: 46rpx;
		color: #252525;
		float: left;
	}

	.bbctouch-oredr-detail-block .order-state {
		float: right;
		height: 46rpx;
		margin-right: 23rpx;
		font-size: 28rpx;
		color: #f15353;
		line-height: 46rpx;
	}

	.bbctouch-oredr-detail-block {
		position: relative;
		z-index: 1;
		display: block;
		padding: 17rpx 0;
		background: #fff;
		clear: both;
		overflow: hidden;
		margin-top: 20rpx;
	}

	.bbctouch-oredr-detail-add {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.bbctouch-oredr-detail-add i.icon-add {
		position: absolute;
		z-index: 1;
		top: -4rpx;
		left: 18rpx;
		display: block;
		width: 46rpx;
		height: 46rpx;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 80%;
		text-align: center;
	}

	.bbctouch-oredr-detail-add dl {
		margin: 0 0 0 74rpx;
		padding: 0 23rpx 0 0;
		display: block;
	}

	.bbctouch-oredr-detail-add dt {
		display: block;
		height: 46rpx;
		font-size: 28rpx;
		line-height: 46rpx;
	}

	.bbctouch-oredr-detail-add dt span {
		margin-left: 14rpx;
		font-family: Helvetica;
	}

	.bbctouch-oredr-detail-add dt span {
		margin-left: 14rpx;
		font-family: Helvetica;
	}

	.bbctouch-oredr-detail-add dd {
		display: block;
		width: 500rpx;
		min-height: 42rpx;
		max-height: 74rpx;
		font-size: 26rpx;
		line-height: 42rpx;
		color: #848689;
	}

	.bbctouch-order-item {
		width: 100%;
		background-color: #fff;
		margin-top: 20rpx;
		display: block;
	}

	.bbctouch-order-item-head {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0 2.5%;
		font-size: 28rpx;
		color: #252525;
		background: #fff;
	}

	.bbctouch-order-item-head image {
		width: 19rpx;
		height: 11rpx;
		opacity: 0.75;
	}

	.bbctouch-order-item-head text {
		margin: 0 8rpx 0 12rpx;
	}

	.bbctouch-order-item-con {
		padding: 0 2.5%;
		background: #f8f8f8;
		display: block;
	}

	.bbctouch-order-item-con .goods-block.detail {
		height: 166rpx;
		position: relative;
		z-index: 1;
		border-bottom: solid #eee 1rpx;
		display: block;
	}

	.bbctouch-order-item-con .goods-block a {
		display: block;
		color: #111;
	}

	.bbctouch-order-item-con .goods-pic {
		display: block;
		width: 130rpx;
		height: 130rpx;
		position: absolute;
		z-index: 1;
		top: 18rpx;
		left: 0;
	}

	.goods-pic .goods-pic-middle {
		width: 130rpx;
		height: 130rpx;
		display: table-cell;
		vertical-align: middle;
	}

	.bbctouch-order-item-con .goods-pic image {
		max-width: 130rpx;
		max-height: 130rpx;
	}

	.bbctouch-order-item-con .goods-info {
		display: block;
		height: 168rpx;
		padding: 18rpx 0;
		margin: 0 184rpx 0 143rpx;
		position: relative;
		z-index: 1;
		overflow: hidden;
		/* display: -webkit-box; */
		/* -webkit-box-align: center; */
	}

	.bbctouch-order-item-con .goods-info .goods-name {
		overflow: hidden;
		height: 72rpx;
		font-size: 26rpx;
		line-height: 40rpx;
		margin-bottom: 0;
		color: #333;
		display: -webkit-box !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.bbctouch-order-item-con .goods-subtotal {
		display: block;
		position: absolute;
		z-index: 1;
		top: 20rpx;
		right: 0;
		text-align: right;
		overflow: hidden;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-price {
		display: block;
		font-size: 26rpx;
		line-height: 42rpx;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-price em {
		font-size: 26rpx;
		font-family: Helvetica;
		display: inline-block;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-num {
		display: block;
		font-size: 26rpx;
		line-height: 42rpx;
		color: #999;
	}

	.bbctouch-order-item-con .goods-subtotle {
		padding: 18rpx 0;
		display: block;
	}

	.bbctouch-order-item-con .goods-subtotle dl {
		font-size: 26rpx;
		line-height: 42rpx;
		overflow: hidden;
		margin-bottom: 5rpx;
		display: block;
	}

	.bbctouch-order-item-con .goods-subtotle dt {
		float: left;
		color: #555;
	}

	.bbctouch-order-item-con .goods-subtotle dd {
		float: right;
		color: #000;
		text-align: right;
	}

	.bbctouch-order-item-con .goods-subtotle dl.t {
		font-size: 28rpx;
		line-height: 46rpx;
	}

	.bbctouch-order-item-con .goods-subtotle dt {
		float: left;
		color: #555;
	}

	.bbctouch-order-item-con .goods-subtotle dd {
		float: right;
		color: #000;
		text-align: right;
	}

	.bbctouch-oredr-detail-block {
		position: relative;
		z-index: 1;
		display: block;
		padding: 17rpx 0;
		background: #fff;
		clear: both;
		overflow: hidden;
	}

	.bbctouch-oredr-detail-block .beizhu {
		display: inline-block;
		vertical-align: top;
		height: 46rpx;
		margin-left: 18rpx;
		font-size: 28rpx;
		line-height: 46rpx;
		color: #252525;
	}

	.bbctouch-oredr-detail-block .beizhu i {
		display: inline-block;
		text-align: center;
		vertical-align: top;
		width: 46rpx;
		height: 46rpx;
		margin-right: 10rpx;
		background-position: 50% 50%;
		background-repeat: no-repeat;
		background-size: 60%;
		opacity: 0.9;
	}

	.bbctouch-oredr-detail-block {
		position: relative;
		z-index: 1;
		display: block;
		padding: 18rpx 0;
		background: #fff;
		clear: both;
		overflow: hidden;
	}

	.bbctouch-oredr-detail-block .beizhu {
		display: inline-block;
		vertical-align: top;
		height: 46rpx;
		margin-left: 18rpx;
		font-size: 28rpx;
		line-height: 46rpx;
		color: #252525;
	}

	.bbctouch-oredr-detail-block h3 i {
		display: inline-block;
		vertical-align: top;
		width: 46rpx;
		height: 46rpx;
		margin-right: 10rpx;
		background-position: 50% 50%;
		background-repeat: no-repeat;
		background-size: 60%;
		opacity: 0.9;
	}

	.bbctouch-oredr-detail-block .info {
		margin-left: 74rpx;
		font-size: 26rpx;
		line-height: 42rpx;
		display: block;
		color: #6d6d6d;
	}

	.bbctouch-oredr-detail-block {
		position: relative;
		z-index: 1;
		display: block;
		padding: 17rpx 0;
		background: #fff;
		clear: both;
		overflow: hidden;
		margin-top: 20rpx;
	}

	.bbctouch-oredr-detail-block .order-log {
		padding: 0 23rpx;
		display: block;
	}

	.bbctouch-oredr-detail-block .order-log view {
		font-size: 26rpx;
		line-height: 42rpx;
		color: #6d6d6d;
	}

	.refund {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.refund .re_btn {
		font-size: 26rpx;
		padding: 6rpx 16rpx;
		color: #f15353;
		border-radius: 5rpx;
		margin-left: 10rpx;
	}

	.botton_btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 120rpx;
		color: #686868;
		font-size: 26rpx;
		background-color: #eaedf1;
		z-index: 999;
		width: 750rpx;
		margin: 0 auto;
	}

	.botton_btn .btn {
		background-color: #fff;
		padding: 0 30rpx;
		height: 70rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
		text-align: center;
		line-height: 70rpx;
		border: 1rpx solid #bfbfbf;
	}

	#order-info-container {
		padding-bottom: 120rpx;
	}

	.grade_discount {
		display: flex;
		align-items: center;
	}

	.grade_discount view {
		position: relative;
		padding-top: 10rpx;
	}

	.grade_discount image {
		width: 120rpx;
		height: 30rpx;
	}

	.grade_discount text {
		position: absolute;
		left: 0;
		top: 10rpx;
		width: 120rpx;
		height: 32rpx;
		text-align: center;
		font-size: 20rpx;
		line-height: 32rpx;
	}

	.navigate {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.navigate image {
		width: 100%;
		height: 100%;
	}

	.goods-subtotle dl dd em {
		display: inline-block;
	}
	a{
		text-decoration: none;
	}
	em{
		font-style: normal;
	}
	.goods-type{
		background-color: rgba(236, 55, 55, 1);
		color: #fff;
		font-size: 26rpx;
		padding: 4rpx 10rpx;
		border-radius: 6rpx;
		display: inline-block;
	}
</style>
