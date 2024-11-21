<template>
	<view>
		<view class="order_detail" v-if="order_info">
			<view class="bbctouch-order-list" id="order-info-container">
				<view class="order-header">
					<view class="order_det_num"><span>{{$L('订单号：')}}</span> {{order_info.order_sn}}</view>
					<view class="order-state"><span>{{$L('order_status')}}</span> {{order_info.state_desc}}</view>
					<view>
						<span>{{$L('创建时间：')}}</span>
						{{
							(new Date(order_info.add_time.replace(" ", "T"))).toLocaleString("es-ES", { 
								year: "numeric", 
								month: "long", 
								day: "numeric"
							})
						}}
					</view>
				</view>

			
		
				<view class="bbctouch-order-item">
					<!--
					<view class="bbctouch-order-item-head" :data-store-id="order_info.vid" @tap.stop="go_vendor">
						<image src="/static/images/store_b.png" mode="widthFix"></image>
						<text>{{order_info.store_name}}</text>
						<image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
					</view>
					-->
					<view class="bbctouch-order-item-con">
						<view v-for="(item, index) in order_info.goods_list" :key="index" class="goods-block detail">
							<a :data-goods-id="item.gid" href="javascript:void(0)" @tap.stop="go_goods_detail">
								<view class="goods-pic">
									<view class="goods-pic-middle">
										<image :src="item.image_url"></image>
									</view>
								</view>
								<view class="goods-info">
									<view>
										<div class="goods-name">{{item.goods_name}}</div>
										<div class="goods-type" v-if="item.goods_type_cn!=''">{{item.goods_type_cn}}</div>
									</view>
									<view class="goods-subtotal">
										<div class="goods-num">{{item.goods_num}} {{$L('unid')}}</div>
										<div class="goods-price">{{$L('￥')}}<em>{{item.goods_price}}</em></div>
										<div class="sales_by"> {{$L('sales_by')}} {{order_info.store_name}}</div>
										<view class="refund">
											<view class="re_btn" :data-order-id="item.order_id" :data-gid="item.rec_id" data-type="refund" @tap.stop="refund"
											v-if="item.refund==1&&item.goods_type!=5||item.refund==3&&item.goods_type!=5">{{$L('退款')}}</view>
											<view class="re_btn" :data-order-id="item.order_id" :data-gid="item.rec_id" data-type="return" @tap.stop="sales_return"
											v-if="item.refund==1&&item.goods_type!=5">{{$L('退货')}}</view>
											<view class="re_btn" v-if="order_info.order_state > 20&&item.refund == 0">{{$L('退款退货中···')}}</view>
										</view>
									</view>
								</view>
							</a>
						</view>
					</view>
				</view>

				<view class="summary">
					<view class="summary-head">
						{{$L('summary_title')}}
					</view>
					<view class="summary-body">
						<view class="sada" :hidden="order_info.promotion.length>0?false:true">
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

				<view class="tracing">
					<view class="tracing-head">{{$L('tracing')}}</view>
					<view class="tracing-body">
						<view>
							{{$L('创建时间：')}}
							{{
								(new Date(order_info.add_time.replace(" ", "T"))).toLocaleString("es-ES", { 
									year: "numeric", 
									month: "long", 
									day: "numeric"
								})
							}}
						</view>
						<view :hidden="order_info.payment_time?false:true">{{$L('付款时间：')}} {{order_info.payment_time}} </view>
						<view :hidden="order_info.shipping_time?false:true">{{$L('发货时间：')}}{{order_info.shipping_time}}</view>
						<view :hidden="order_info.finnshed_time?false:true">{{$L('完成时间：')}}{{order_info.finnshed_time}}</view>
					</view>
				</view>

				<view class="address">
					<view class="address-head">{{$L('mailing_address')}}</view>
					<view class="address-body">
						<dl class="md-addr" v-if="order_info.ziti==1 && order_info.dian_id>0">
							<dd><span>{{$L('门店地址：')}}</span>{{order_info.dian.dian_address}}</dd>
							<dd v-if="order_info.order_state != 10"><span>{{$L('核销码：')}}</span>{{order_info.hexiao_code}}</dd>
							<dd><span>{{$L('自提门店：')}}</span>{{order_info.dian.dian_name}} {{order_info.dian.dian_phone[1]}}</dd>
						</dl>
						<dl v-else>
							<dd><span>{{$L('收货地址：')}}</span>{{order_info.reciver_addr}}</dd>
							<dt><span>{{$L('收货人：')}}</span>{{order_info.reciver_name}} {{order_info.reciver_phone}}</dt>
						</dl>
						<view class="navigate" @tap="showCz" v-if="order_info.ziti==1 && order_info.dian_id>0">
							<image :src="img_url+'navigate.png'" mode="aspectFit"></image>
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

				<view :hidden="order_info.payment_name?false:true" class="payment_method">
					<view class="payment_method-head">{{$L('付款方式')}}</view>
					<view class="payment_method-body">
						{{order_info.payment_name}}
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
	.order-header{
		background-color:#fff;
		margin: 30rpx;
		border-radius: 15rpx;
		overflow:hidden;

		font-weight: normal;
		font-size: 26rpx;
		padding:20rpx;
		color: #666;
		border-bottom: 1px solid #eee;
	}
	.order-header span{
		font-weight: bold;
	}

	.order-header .order_det_num {

	}

	.order-header .order-state {

	}

	.bbctouch-order-item {
		background-color:#fff;
		margin: 30rpx;
		border-radius: 15rpx;
		overflow:hidden;
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
		padding:20rpx;
		display: block;
		font-size: 26rpx;
		color: #666;
		border-bottom: solid #eee 1rpx;
	}
	.bbctouch-order-item-con:nth-last-child(1){
		border-bottom: none;
	}

	.bbctouch-order-item-con .goods-block.detail {
		position: relative;
		z-index: 1;
		display: block;
	}

	.bbctouch-order-item-con .goods-block a {
		display: flex;
		gap: 20rpx;
		align-items:center;
		color: #111;
	}

	.bbctouch-order-item-con .goods-pic {
		display: block;
		flex: 180rpx 0 0;
		width: 180rpx;
		height: 180rpx;
	}

	.goods-pic .goods-pic-middle {
		width: 180rpx;
		height: 180rpx;
	}

	.bbctouch-order-item-con .goods-pic image {
		max-width: 180rpx;
		max-height: 180rpx;
	}

	.bbctouch-order-item-con .goods-info {
		flex: 1;
		color: #666;
	}

	.bbctouch-order-item-con .goods-info .goods-name {
		font-weight: bold;
	}

	.bbctouch-order-item-con .goods-subtotal {

	}

	.bbctouch-order-item-con .goods-subtotal .goods-price {

	}
	.bbctouch-order-item-con .goods-subtotal .sales_by{
		font-size:22rpx;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-price em {

	}

	.bbctouch-order-item-con .goods-subtotal .goods-num {
		color: #666;
	}

	.summary,.tracing,.payment_method,.address{
		background-color:#fff;
		margin: 30rpx;
		border-radius: 15rpx;
		overflow:hidden;
	}
	.summary-head,.tracing-head,.payment_method-head,.address-head{
		font-weight: bold;
		font-size: 26rpx;
		padding:20rpx;
		color: #666;
		border-bottom: 1px solid #eee;
	}
	.address-body span{
		font-weight: bold;
	}
	.summary-body,.tracing-body,.payment_method-body,.address-body {
		padding:20rpx;
		display: block;
		font-size: 26rpx;
		color: #666;
	}

	.summary-body dl {
		font-size: 26rpx;
		line-height: 42rpx;
		overflow: hidden;
		margin-bottom: 5rpx;
		display: block;
	}

	.summary-body dt {
		float: left;
		color: #555;
	}

	.summary-body dd {
		float: right;
		color: #000;
		text-align: right;
	}

	.summary-body dl.t {
		font-weight: bold;
	}

	.summary-body dt {
		float: left;
		color: #555;
	}

	.summary-body dd {
		float: right;
		color: #000;
		text-align: right;
	}
	.summary-body dl dd em {
		display: inline-block;
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

	

	.order-log {
		padding: 0 23rpx;
		display: block;
	}

	.order-log view {
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
		color: #fff;
		background-color: #000;
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
